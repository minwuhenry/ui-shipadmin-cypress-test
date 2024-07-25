/*
👋 “Hey” from the Praxis team
This configuration file already implements our standard formatting rules, including compatability with eslint.
*/

//see https://git.minhenry.com/Praxis-Framework/create-praxis-app/tree/master/packages/format
const praxisDefault = require('@praxis/format')

// add or override additional options here: https://prettier.io/docs/en/options.html
module.exports = Object.assign({}, praxisDefault)
