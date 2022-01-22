// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

if (context.params.event.content.toLowerCase().includes('!myinfo')) {
    
    let userID = context.params.event.author.id;
    let userName = context.params.event.author.username;
    let channelID = context.params.event.channel_id;
    let messageContent = "";
    let tableUserStatsName = "user_stats";
    
   // make API request for retrieving selected user id
   let selectResult = await lib.airtable.query['@1.0.0'].select({
     table: tableUserStatsName,
     where: [
       {
         'user_id__is': userID
       }
     ],
     limit: {
       'count': 0,
       'offset': 0
     }
   });
  
  let exp = 0;
  let level = 1;
  
  if (!selectResult.rows.length) {
    let insertResult = await lib.airtable.query['@1.0.0'].insert({
      table: tableUserStatsName,
      fieldsets: [
        {
          'user_id': userID,
          'user_name': userName,
          'exp': exp,
          'level': level,
          'status': 'active'
        }
      ],
      typecast: false
    });
    
    messageContent = `Hi `+userName+`! Welcome to the club! enjoy the party :tada: :tada: \nHere is your status`;
  }else{
    exp = selectResult.rows[0].fields.exp;
    level = selectResult.rows[0].fields.level;
    messageContent = `Hi `+userName+`! Here is your status`;
  }
  
  await lib.discord.channels['@0.2.0'].messages.create({
    "channel_id": channelID,
    "content": messageContent,
    "tts": false,
    "embeds": [
      {
        "type": "rich",
        "title": "",
        "description": "",
        "color": 0x00FFFF,
        "fields": [
          {
            "name": `Username:`,
            "value": userName
          },
          {
            "name": `EXP:`,
            "value": exp
          },
          {
            "name": `Level:`,
            "value": level
          }
        ]
      }
    ]
  });
  
}