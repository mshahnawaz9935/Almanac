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
        } 
        else if (results.error) {
          console.log(results);
         return res.end(JSON.stringify(results));
        } 
        else {
        token = access_token;
        req.session.token = access_token;
        console.log(access_token);
         
        }
      });
    res.redirect('/search');
});


router.get('/checklogin', function(req,res,next){

        if(token == undefined)
        {
        res.json('No Login');
        }
        else
        res.json('Logged in');

});

router.get('/logout', function(req,res,next){

    req.session.destroy();
        token = undefined;
        res.redirect('http://localhost:3000');

});


router.get('/token', function(req, res,next){
    if(token!= undefined)
    {
         writetonote(token, req.session.topic, req.session.chapter);
         res.redirect('/search');
    }
    else 
        res.redirect('/search');
});

function writetonote(token,topic,chapter)
{
    console.log('inside token' , topic,chapter);
    var url = '';
    var queryObject =  {
    "userID":"IOK_Postman_Testing",
    "parameters":{
            "parameterInstance":[
                {"name":"complexity","value":5},
                {"name":"duration","value":4}, 
                {"name":"topic","value":topic},
                {"name":"chapter","value":chapter}
            ]
        }
    } ;
    var favourites = {};
    request({
        url: "http://kdeg-vm-43.scss.tcd.ie/ALMANAC_Personalised_Composition_Service/composer/atomiccompose",
        method: "POST",
        json: true,   // <--Very important!!!
        body: queryObject,
        headers: {
            "content-type": "application/json",  // <--Very important!!!
        },
        }, function (error, response, body){

            console.log("post query" + response.body);
            favourites = response.body;
            console.log(favourites.sections.section.length);
            for(var i=0; i< favourites.sections.section.length; i++) 
            {  
                    url = url + " <h3>Images from section "+ (i+1) + " are as under</h3>";
                    url = url + "<h4>" +  favourites.sections.section[i].text.text + "</h4>";
                    try{
                        var image_len = favourites.sections.section[i].images.image.length;
                    }
                    catch(err)
                    {    continue;  }
                    finally { }
                    for(var j=0; j< image_len;j++)
                    {
                    url = url+ "<p><img src=" + "\"" + favourites.sections.section[i].images.image[j].url + "\"" + "/></p>";
                    }
                }
            
        });
        
       
       //  console.log(htmlPayload); 
        setTimeout(function()
        {   
                var htmlPayload =
        "<!DOCTYPE html>" +
        "<html>" +
        "<head>" +
        "    <title>"+ favourites.title +"</title>" +
        "    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\">" +
        "</head>" +
        "<body>" +
        "    <p> View Your Page <i>formatted</i></p>" +
         url +
        "</body>" +
        "</html>";   
            
            createPage(token, htmlPayload, false); 
        }, 1500);
     
    }


        function dateTimeNowISO() {
            return new Date().toISOString();
            }

            function createPage(accessToken, payload, multipart) {
            var options = {
                url: oneNotePagesApiUrl,
                headers: {
                'Authorization': 'Bearer ' + accessToken
                }
            };
            console.log('ACCESS TOKEN IS' + accessToken ,' Payload is', payload);
            // Build simple request
            if (!multipart) {
                options.headers['Content-Type'] = 'text/html';
                options.body = payload;
            }
            var r = request.post(options);
            // Build multi-part request
            if (multipart) {
                var CRLF = '\r\n';
                var form = r.form(); // FormData instance
                _.each(payload, function(partData, partId) {
                form.append(partId, partData.body, {
                    // Use custom multi-part header
                    header: CRLF +
                    '--' + form.getBoundary() + CRLF +
                    'Content-Disposition: form-data; name=\"' + partId + '\"' + CRLF +
                    'Content-Type: ' + partData.contentType + CRLF + CRLF
                });
                });
            }
            }


module.exports = router;