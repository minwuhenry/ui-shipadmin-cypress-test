/*
👋 “Hey” from the Praxis team
This configuration file already implements our standard precommit logic.
*/

module.exports = {
  // see https://git.minhenry.com/Praxis-Framework/create-praxis-app/tree/master/packages/precommit
  ...require('@praxis/precommit'),
  // add or override additional commands here: https://github.com/okonet/lint-staged
}
