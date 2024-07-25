/*
👋 “Hey” from the Praxis team
This configuration file already implements our standard jest configuration.
*/

//see https://git.minhenry.com/Praxis-Framework/create-praxis-app/tree/master/packages/test-configuration
const praxisDefault = require('@praxis/test-configuration')

// add or override additional options here: https://jestjs.io/docs/en/configuration
module.exports = Object.assign({}, praxisDefault, {
  // add additional configurations entries here
})
