// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.utils.kv['@0.1.16'].set({
  key: `${context.params.event.code}_invite`,
  value: context.params.event.uses,
});

console.log("invite sent");
console.log(context.params.event);