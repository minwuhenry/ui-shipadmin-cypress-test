/*

👋 “Hey” from the Praxis team!

Using TAP configuration to set environment-based values at cluster initialization - see:
@praxis/component-runtime-env - https://praxis.prod.minhenry.com/components/runtime-env


 ***ONLY*** configurations shared between most or all environments can be stored in commonConfig
 Please add any configurations specific to environments in their respective "config.json" files for their TAP env

For local development using 'npm run start' copy the config.json file into the public directory

*/

const commonConfig = {
  auth: {
    authorizationUrl:
      'https://oauth.iam.perf.minhenry.com/auth/oauth/v2/authorize',
    logoutUrl:
      'https://logonservices.iam.perf.minhenry.com/login/responses/logoff.html',
  },
}

export default commonConfig
