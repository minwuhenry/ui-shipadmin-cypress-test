/*
👋 “Hey” from the Praxis team
This configuration file already implements our standard lint rules, including compatability with prettier.
*/

module.exports = {
  // see https://git.minhenry.com/Praxis-Framework/create-praxis-app/tree/master/packages/eslint-config-praxis
  plugins: ['cypress'],
  extends: ['@praxis/eslint-config-praxis'],
  rules: {
    'no-console': 0, //change this depending on your development needs
    'testing-library/prefer-screen-queries': 'off', //follow https://praxis.prod.minhenry.com/releases/release-notes?view=scripts
    // add or override additional rules here: https://eslint.org/docs/rules/
  },
  // Added following (courtesy https://github.com/cypress-io/cypress/issues/5473) to fix "context not defined", etc. and other Cypress-related linting errors
  root: true,
  env: {
    'cypress/globals': true,
  },
}
