const config = {
  auth: {
    clientId: 'ccshipadmin_npe_im',
    authorizationUrl:
      'https://oauth.iam.perf.minhenry.com/auth/oauth/v2/authorize',
    logoutUrl:
      'https://logonservices.iam.perf.minhenry.com/login/responses/logoff.html',
  },
  api: {
    apiHistory:
      'https://ccshipadminbackend-stage.dev.minhenry.com/api_histories/',
    apiHistoryDownload:
      'https://ccshipadminbackend-stage.dev.minhenry.com/api_histories/fetchFileData/',
  },
}

export default config
