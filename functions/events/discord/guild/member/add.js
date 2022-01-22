// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

  let userID = context.params.event.user.id;
  let userName = context.params.event.user.username;
  let guildID = context.params.event.guild_id;
  let tableUserStatsName = "user_stats";
  
  let channels = await lib.discord.guilds['@0.0.2'].channels.list({
    guild_id: guildID
  });
  
  let welcomeAndRulesChannel = channels.find((channel) => {
    return channel.name === 'welcome-and-rules';
  });
  
  if (welcomeAndRulesChannel) {
    await lib.discord.channels['@0.2.0'].messages.create({
      "channel_id": welcomeAndRulesChannel.id,
      "content": `Hi `+userName+`, Thanks for joining **RitxmanRX's Residence**`,
      "tts": false,
      "embeds": [
        {
          "type": "rich",
          "title": `Guild rules`,
          "description": `Here are some things to know about this guild:`,
          "color": 0x00FFFF,
          "fields": [
            {
              "name": `Rule #1`,
              "value": `Introduce yourself!`
            },
            {
              "name": `Rule #2`,
              "value": `Be yourself!`
            },
            {
              "name": `Rule #3`,
              "value": `Don't be evil.`
            }
          ]
        }
      ]
    });
  }

let invites_list = await lib.discord.guilds['@0.1.0'].invites.list({
  guild_id: guildID,
});
let invite = null;
for (let i = 0; i < invites_list.length; i++) {
  let previous_uses = await lib.utils.kv['@0.1.16'].get({
    key: `${invites_list[i].code}_invite`,
  });
  if (previous_uses + 1 === invites_list[i].uses) {
    invite = {
      inviter: invites_list[i].inviter.id,
      code: invites_list[i].code
      };
    await lib.utils.kv['@0.1.16'].set({
      key: `${invites_list[i].code}_invite`,
      value: invites_list[i].uses,
    });
    break;
  }
}
if (invite) {
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: welcomeAndRulesChannel.id,
    content: ``,
    tts: false,
    embeds: [
      {
        type: 'rich',
        title: `Invite log`,
        description: '',
        color: 0x0008ff,
        fields: [
          {
            name: `Inviter`,
            value: `<@${invite.inviter}>`,
            inline: true,
          },
          {
            name: `Invited`,
            value: `<@${context.params.event.user.id}>`,
            inline: true,
          },
          {
            name: `Invite link`,
            value: `https://discord.gg/${invite.code}`,
            inline: true,
          },
        ],
        timestamp: `${new Date().toISOString()}`, 
      },
    ],
  });
  
  // make API request retrieving user exp data
  let userExpResult = await lib.airtable.query['@1.0.0'].select({
    table: tableUserStatsName,
    where: [
      {
        'user_id__is': invite.inviter
      }
    ],
    limit: {
      'count': 0,
      'offset': 0
    }
  });
  
  if(userExpResult.rows.length > 0){
  
    let userExp = userExpResult.rows[0].fields.exp;
  
    userExp+=10;
  
    // make API request to update user exp
    let result = await lib.airtable.query['@1.0.0'].update({
      table: tableUserStatsName,
      where: [
        {
          'user_id__is': invite.inviter
        }
      ],
      limit: {
        'count': 0,
        'offset': 0
      },
      fields: {
        'exp': userExp
      },
      typecast: false
    });
  
  }
  
}