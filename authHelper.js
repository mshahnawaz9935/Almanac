

var OAuth = require('oauth');
var uuid = require('node-uuid');

// The application registration (must match Azure AD config)
var credentials = {
  authority: 'https://login.microsoftonline.com/common',
  authorize_endpoint: '/oauth2/v2.0/authorize',
  token_endpoint: '/oauth2/v2.0/token',
  // client_id: 'd23a1a63-2516-4822-bbef-ac9fbf1c05fa',
  // client_secret: 'DrqO19XuXbGyHVz3oULCHdX',
  // redirect_uri: 'http://localhost:3000/onenote/login',
  client_id: 'fa64935f-0786-46d4-9a8d-b9e4b6d66fa9',
  client_secret: 'wMiUNne6zxtmmgTjb4CUOJ7',
  redirect_uri: 'http://localhost:3000/onenote/login',
  scope: ['User.Read Mail.Send Mail.ReadWrite Notes.Create offline_access ']
};


function getAuthUrl() {
  return credentials.authority + credentials.authorize_endpoint +
    '?client_id=' + credentials.client_id +
    '&response_type=code' +
    '&redirect_uri=' + credentials.redirect_uri +
    '&scope=' + credentials.scope +
    '&response_mode=query' +
    '&nonce=' + uuid.v4() +
    '&state=abcd';
}

/**
 * Gets a token for a given resource.
 * @param {string} code An authorization code returned from a client.
 * @param {AcquireTokenCallback} callback The callback function.
 */
function getTokenFromCode(code, callback) {
  var OAuth2 = OAuth.OAuth2;
  var oauth2 = new OAuth2(
    credentials.client_id,
    credentials.client_secret,
    credentials.authority,
    credentials.authorize_endpoint,
    credentials.token_endpoint
  );

  oauth2.getOAuthAccessToken(
    code,
    {
      grant_type: 'authorization_code',
      redirect_uri: credentials.redirect_uri,
      response_mode: 'form_post',
      nonce: uuid.v4(),
      state: 'abcd'
    },
    function (e, accessToken, refreshToken) {
      callback(e, accessToken, refreshToken);
    }
  );
}


/**
 * Gets a new access token via a previously issued refresh token.
 * @param {string} refreshToken A refresh token returned in a token response
 *                       from a previous result of an authentication flow.
 * @param {AcquireTokenCallback} callback The callback function.
 */
function getTokenFromRefreshToken(refreshToken, callback) {
  var OAuth2 = OAuth.OAuth2;
  var oauth2 = new OAuth2(
    credentials.client_id,
    credentials.client_secret,
    credentials.authority,
    credentials.authorize_endpoint, 
    credentials.token_endpoint
  );

  oauth2.getOAuthAccessToken(
    refreshToken,
    {
      grant_type: 'refresh_token',
      redirect_uri: credentials.redirect_uri,
      response_mode: 'form_post',
      nonce: uuid.v4(),
      state: 'abcd'
    },
    function (e, accessToken) {
      callback(e, accessToken);
    }
  );
}

exports.credentials = credentials;
exports.getAuthUrl = getAuthUrl;
exports.getTokenFromCode = getTokenFromCode;
exports.getTokenFromRefreshToken = getTokenFromRefreshToken;
exports.ACCESS_TOKEN_CACHE_KEY = 'ACCESS_TOKEN_CACHE_KEY';
exports.REFRESH_TOKEN_CACHE_KEY = 'REFRESH_TOKEN_CACHE_KEY';
