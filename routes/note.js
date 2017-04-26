const express = require('express');
const router = express.Router();
var request=require('request');

var config = require('./config');
var _ = require('underscore');
var request = require('request');

var oneNotePagesApiUrl = 'https://www.onenote.com/api/v1.0/pages';

var OAuth = require('oauth');
var OAuth2 = OAuth.OAuth2;
var oauth2 = new OAuth2(config.clientID, config.clientSecret, config.baseSite, config.authorizePath, config.tokenURL, null);

var token ;
  var params = {
      'redirect_uri': config.redirectUrl.toString(),
      'grant_type': config.grant_type
    }

router.get('/', function(req, res,next){

 var authURL = oauth2.getAuthorizeUrl(
    _.extend({
      redirect_uri: config.redirectUrl
    }, config.authURLParams)
  );

  console.log("..authURL.....", authURL);
     res.redirect(authURL);
});

router.get('/callback', function(req, res,next){

    var code = req.query.code;


    console.log('code is' + code);
     oauth2.getOAuthAccessToken(
      code, params,
      function(e, access_token, refresh_token, results) {
        if (e) {
          console.log("Error:==>", e);
         return res.end(e);
        } else if (results.error) {
          console.log(results);
         return res.end(JSON.stringify(results));
        } else {
        //    writetonote(access_token);
        token = access_token;
        console.log(access_token);
        //  res.json('Signed in ' + access_token);
         
        }
      });
    res.redirect('/');
});


router.get('/token', function(req, res,next){
    if(token!= undefined)
    {
        console.log(favourites);
    res.json('token is ' + token);
    }
    else res.json('no token authenticate first');

});


module.exports = router;