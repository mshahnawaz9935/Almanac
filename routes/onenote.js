var express = require('express');
var router = express.Router();
var authHelper = require('../authHelper.js');
 var https = require ('https');
 const http = require('http')
 var request = require('request');
 var fs = require("fs");
   var _ = require('underscore');
  var base64Img = require('base64-img');
  var MongoClient = require('mongodb').MongoClient , format = require('util').format;

/* GET home page. */
var t=2,sec=2;
var notebookid;
var sectionid;
var key = '?sv=2016-05-31&ss=bfqt&srt=sco&sp=rc&se=2018-04-23T22:53:50Z&st=2017-07-20T14:53:50Z&spr=https&sig=AhAPJr%2BBr5urTfnfBKaF2hnIkpS1xEUCbekiNZW4Od4%3D';

function getToken (callback)
{
    var token = '';
    var favourites ={};

   var qs = require("querystring");
   var request = require('request');

    var url = '';
    var queryObject =  qs.stringify({ grant_type: 'client_credentials',
    client_id: '150b9f0f-ab92-4565-a38e-4f28f3deb136',
    client_secret: 'Q1a09Fx13lEcU/RwM8AsVsBolhP/QRvGNJGqzLupivM=',
    resource: '150b9f0f-ab92-4565-a38e-4f28f3deb136' });
    var favourites = {};    
    request({
        url: "https://login.microsoftonline.com/3105192b-76b3-4f26-816e-9b7e773ac262/oauth2/token",
        method: "POST",
        body: queryObject,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",  // <--Very important!!!
        },
        }, function (error, response){
            // console.log (JSON.parse(response.body).access_token);   
             token =  JSON.parse(response.body).access_token;    
             callback(token);
        });
}

router.get('/userlogin', (req, res) => {

    var username = req.query.username;
    var password = req.query.password;
    MongoClient.connect('mongodb://remotemongodb:J3gcFVlTzb4KznFQ8Rbsz7V7cEROONHgSQMXkyI8wswQ41afGnkEvkn1iYmT01ktjvCH1FLOSYiaQi0t893rNw==@remotemongodb.documents.azure.com:10250/?ssl=true', function (err, db) {        //Run mongodb and its service mongod.exe
 //  MongoClient.connect('mongodb://127.0.0.1:27017/userdata',function(err, db) {
    if (err) {
        throw err;
    } else {
        console.log("successfully connected to the database");
            var collection = db.collection('login');
            // collection.insert({ username: username , password : password}, function(err, docs) {
            //     collection.count(function(err, count) {
            //         console.log(format("count = %s", count));
            //     });
            // });
             collection.find().toArray(function(err, results) {
               var counter = 0;
               if(results.length > 0)
               {   
                 results.forEach(function (result)
                {
                if(result.username == username && result.password == password)
                {
                  console.log(result);
                   req.session.login = 'Logged in via database';
                console.log(req.session.login);
                    req.session.email = result.username;
                counter++;
                      res.cookie(authHelper.sessionemail, req.session.email);
                req.session.save();
                console.log(req.session.email);
                 }
                })
                if(counter > 0)
                 res.json('User exists');
                else res.json('User doesnt exists' );
               }
                else res.json('User doesnt exists' );
            });

    }
    db.close();
});
});



router.get('/', function (req, res) {
  // check for token
  if (req.cookies.REFRESH_TOKEN_CACHE_KEY === undefined) {
    req.session.destroy();
    console.log('here');
    res.clearCookie('nodecookie');
    clearCookies(res);
    res.redirect('/onenote/login');
  } else {
      console.log('Logged in' );
       req.session.login ='Logged in';
        res.redirect('/modules');
  }
});
router.get('/aboutmail', function (req, res) {

  aboutmail(req,res);
});

router.get('/getpages', function (req, res) {

    getonenotearticles(req.cookies.ACCESS_TOKEN_CACHE_KEY, function(data)
    {
        res.json(data);

    })
});

router.get('/deletepages', function (req, res) {

    var pageid = req.query.pageid;
    console.log(pageid);
    deleteonenotearticles(req.cookies.ACCESS_TOKEN_CACHE_KEY, pageid, function(data)
    {
        res.json(data);

    })
});



router.get('/aboutme', function (req, res) {

    // if (req.cookies.REFRESH_TOKEN_CACHE_KEY === undefined) {
    //   console.log('empty');
    //   req.session.destroy();
    //   res.clearCookie('nodecookie');
    //   clearCookies(res);
    // }
    // else
    // {
      console.log('not empty' , 'acess token is ', req.cookies.ACCESS_TOKEN_CACHE_KEY);
       aboutme(req,res);
   // }
});


router.get('/checknote2', function (req, res) {
  // check for token
   checknote2(req,res);
  setTimeout(function()
  {
    console.log('t is', t);
    if(t == 1)
    {
      checksection(req.cookies.ACCESS_TOKEN_CACHE_KEY , 'Almanac');
       setTimeout(function()
       {
          console.log( 'sec is ', sec);
      if(sec==1)
      {
        console.log('Both exists');
       writespecific(req.cookies.ACCESS_TOKEN_CACHE_KEY, req.session.topic, req.session.chapter);

      }
      else
      {
        console.log('Notebook exists and section created');
        createsection(req.cookies.ACCESS_TOKEN_CACHE_KEY , notebookid , req.session.modulename);
          setTimeout(function()
          {
              writespecific(req.cookies.ACCESS_TOKEN_CACHE_KEY, req.session.topic, req.session.chapter);
          },4700);
      }
       },1500);

    }
     else 
     {
       console.log('Notebook and section created');
      // res.json('Notebook created');
      createnotebook(req.cookies.ACCESS_TOKEN_CACHE_KEY ,req.session.modulename);
      setTimeout(function()
          {
              writespecific(req.cookies.ACCESS_TOKEN_CACHE_KEY, 'lava', 'Volcanoes');
          },6500);
    }
  },1200);
    //    res.json('Notebooks created or updated and data saved to Note');
     
});

router.get('/checknote3', function (req, res) {

  console.log('check token' , req.cookies.ACCESS_TOKEN_CACHE_KEY);
  
  checknote2(req.cookies.ACCESS_TOKEN_CACHE_KEY , function(t , notebookid)
  {
    if(t==1)
    {
       console.log('notebook id' ,notebookid);
    checksection(req.cookies.ACCESS_TOKEN_CACHE_KEY , notebookid , req.session.modulename , function(sec, sectionid)
    {
     
       if(sec == 1){
         createarticle(req.cookies.ACCESS_TOKEN_CACHE_KEY, req.session.topic, req.session.chapter , req.session.articleid , req.session.studentid , req.session.moduleid);
       res.json('Notebook exists id is ' + notebookid + 'Section exists id is' + sectionid);
       }
       else if(sec==0)
       {
         createsection(req.cookies.ACCESS_TOKEN_CACHE_KEY, notebookid , req.session.modulename , function(sectionid)
         {
           createarticle(req.cookies.ACCESS_TOKEN_CACHE_KEY, req.session.topic, req.session.chapter , req.session.articleid , req.session.studentid , req.session.moduleid);
            res.json('Notebook exists and section created' + sectionid);
         });

       }

    });
    }
    else if(t==0)
    {
       console.log('t=0');
      createnotebook(req.cookies.ACCESS_TOKEN_CACHE_KEY , function(notebookid){
         console.log('notebook id' ,notebookid);
      createsection(req.cookies.ACCESS_TOKEN_CACHE_KEY, notebookid ,req.session.modulename, function(sectionid)
         {
           createarticle(req.cookies.ACCESS_TOKEN_CACHE_KEY, req.session.topic, req.session.chapter , req.session.articleid , req.session.studentid , req.session.moduleid);
            res.json('Notebook' + notebookid + 'and section created' + sectionid);
         });
         });
    }



  });

     
});
router.get('/checknote4', function (req, res) {

  console.log('check token' , req.cookies.ACCESS_TOKEN_CACHE_KEY);
  
  checknote2(req.cookies.ACCESS_TOKEN_CACHE_KEY , function(t , notebookid)
  {
    if(t==1)
    {
       console.log('notebook id' ,notebookid);
    checksection(req.cookies.ACCESS_TOKEN_CACHE_KEY , notebookid , req.session.modulename , function(sec, sectionid)
    {
     
       if(sec == 1){
         createOneNoteArticle(req.cookies.ACCESS_TOKEN_CACHE_KEY, req.session.topic, req.session.chapter , req.session.articleid , req.session.studentid , req.session.moduleid
          , function (response)
             {   
                 console.log('Response is',response );
                 if(response.error == undefined)
                 res.json('Notebook exists and section created' + sectionid );
                 else res.json('Pushed to OneNote Failed');
             } );
      
       }
       else if(sec==0)
       {
         createsection(req.cookies.ACCESS_TOKEN_CACHE_KEY, notebookid , req.session.modulename , function(sectionid)
         {
            createOneNoteArticle(req.cookies.ACCESS_TOKEN_CACHE_KEY, req.session.topic, req.session.chapter , req.session.articleid , req.session.studentid , req.session.moduleid
             , function (response)
             {   
                  console.log('Response is',response );
                 if(response.error == undefined)
                 res.json('Notebook exists and section created' + sectionid);
                 else res.json('Pushed to OneNote Failed');
             } );
          
         });

       }

    });
    }
    else if(t==0)
    {
       console.log('t=0');
      createnotebook(req.cookies.ACCESS_TOKEN_CACHE_KEY , function(notebookid){
         console.log('notebook id' ,notebookid);
      createsection(req.cookies.ACCESS_TOKEN_CACHE_KEY, notebookid ,req.session.modulename, function(sectionid)
         {
            createOneNoteArticle(req.cookies.ACCESS_TOKEN_CACHE_KEY, req.session.topic, req.session.chapter , req.session.articleid , req.session.studentid , req.session.moduleid
             , function (response)
             {            
                 console.log('Response is',response  );
                   if(response.error !== undefined)
                 {
                   res.json('Pushed To OneNote Failed');
                 }
                 else res.json('Notebook exists and section created' + sectionid + response);
             } );
           
         });
         });
    }



  });

     
});




function createnotebook(token ,callback)
{
     var options = {
    url: 'https://graph.microsoft.com/beta/me/onenote/notebooks',
    method: 'POST',
    body : JSON.stringify({ "displayName" : "TCD Almanac" }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  };

  request(options, function (err, res, body) {
  if (err) {
    console.log('Post Error :', err)
    return
  }
  console.log('Succesfully Created notebook :', JSON.parse(body).id);
  notebookid =  JSON.parse(body).id;
   callback(notebookid);
});
 
}


router.get('/writenote', function (req, res) {
  // check for token
  writetonote(req.cookies.ACCESS_TOKEN_CACHE_KEY, req.session.topic , req.session.chapter);
   res.redirect('/search');
});
router.get('/checklogin', function (req, res) {        // Wont work directly on angular, need to be executed on node
  // check for token
  // if (req.cookies.ACCESS_TOKEN_CACHE_KEY === undefined) {  // for testing very importnat to neutralize session
  //   req.session.login = '';
  //   console.log('here');
  // }
  console.log(req.session.login , req.session.email);
  if(req.session.login == 'Logged in')
  res.json('Logged in');
  else if(req.session.login == 'Logged in via database')
  res.json('Logged in via database');
  else
  res.json('No Login');
});


router.get('/disconnect', function (req, res) {
  // check for token
  console.log('disconnect');
  res.clearCookie('nodecookie');
  clearCookies(res);
  req.session.destroy();
  
  res.status(200);
  res.redirect('/search');
});

/* GET home page. */
router.get('/login', function (req, res) {
  if (req.query.code !== undefined) {
    authHelper.getTokenFromCode(req.query.code, function (e, accessToken, refreshToken) {
      if (e === null) {
        // cache the refresh token in a cookie and go back to index
        console.log('REFRESH TOKEN during login' , refreshToken);
        res.cookie(authHelper.ACCESS_TOKEN_CACHE_KEY, accessToken);
        res.cookie(authHelper.REFRESH_TOKEN_CACHE_KEY, refreshToken);
        req.session.login ='Logged in';
        res.redirect('/modules');
      } else {
        console.log(JSON.parse(e.data).error_description);
        res.status(500);
        res.send();
      }
    });
  } else {
      console.log(authHelper.getAuthUrl());
      res.redirect(authHelper.getAuthUrl());
  //  res.render('login', { auth_url: authHelper.getAuthUrl() });
  }
});


function aboutme(req,res)
{
    var options = {
    host: 'graph.microsoft.com',
    path: '/v1.0/me',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + req.cookies.ACCESS_TOKEN_CACHE_KEY
    }
  };

  https.get(options, function (response) {
    var body = '';
    response.on('data', function (d) {
      body += d;
    });
    response.on('end', function () {
      var error;
      if (response.statusCode === 200) {
                console.log(body);
                req.session.email = JSON.parse(body).userPrincipalName;
                req.session.save(function(err) {
                  // session saved
                })
                console.log(JSON.parse(body).displayName,'About email' ,  req.session.email); 
                res.cookie(authHelper.sessionemail, JSON.parse(body).userPrincipalName);
                res.json(JSON.parse(body).displayName);
        //callback(null, JSON.parse(body));

      } else {
        error = new Error();
        error.code = response.statusCode;
        error.message = response.statusMessage;
     
        // The error body sometimes includes an empty space
        // before the first character, remove it or it causes an error.
        body = body.trim();
        error.innerError = JSON.parse(body).error;
        console.log(error, null);
           if(error.code === 401 &&
      error.innerError.code === 'InvalidAuthenticationToken' ||
      error.innerError.message === 'Access token has expired.')
      {     
        // console.log('Disconnect');
        //     req.session.destroy();
        //     res.clearCookie('nodecookie');
        //     clearCookies(res);
        //     res.status(200);
        //     res.redirect('/search'); 


            authHelper.getTokenFromRefreshToken(
          req.cookies.REFRESH_TOKEN_CACHE_KEY,
          function (refreshError, accessToken) {
                   // clearCookies(res);
                    console.log('REFRESH TOKEN' ,req.cookies.REFRESH_TOKEN_CACHE_KEY ,'acess token is',accessToken)
            res.cookie(authHelper.ACCESS_TOKEN_CACHE_KEY, accessToken);
            if (accessToken !== null) {
                      console.log('later' + accessToken);
                      req.cookies.ACCESS_TOKEN_CACHE_KEY = accessToken;
                aboutme(req, res);


            } 
          });
          
        }
      }
    });
  }).on('error', function (e) {
    console.log((e, null));
  });

}
function checknote(token ,callback)                                // No use for now
{
    var options = {
    host: 'graph.microsoft.com',
    path: '/beta/me/onenote/notebooks',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  };

  https.get(options, function (response) {
    var body = '';
    response.on('data', function (d) {
      body += d;
    });
    response.on('end', function () {
      var error;
      if (response.statusCode === 200) {
        callback(JSON.parse(body));

      } else {
        error = new Error();
        error.code = response.statusCode;
        error.message = response.statusMessage;
        // The error body sometimes includes an empty space
        // before the first character, remove it or it causes an error.
        body = body.trim();
        error.innerError = JSON.parse(body).error;
        console.log(body, null);
        callback(error.innerError);
      }
    });
  }).on('error', function (e) {
    console.log((e, null));
  });

}

function checknote2(token, callback)
{   t=0;
    var options = {
    host: 'graph.microsoft.com',
    path: '/beta/me/onenote/notebooks?$select=displayName,id',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  };

  https.get(options, function (response) {
    var body = '';
    response.on('data', function (d) {
      body += d;
    });
    response.on('end', function () {
      var error;
      if (response.statusCode === 200) {
            console.log(JSON.parse(body).value.length);
            var data = JSON.parse(body);
            for(var i=0; i< data.value.length; i++)
            {
                console.log(data.value[i].displayName);
                if(data.value[i].displayName == 'TCD Almanac')
                {
                 t=1;
                 notebookid = data.value[i].id;
                }
            }
            if(t==1)
            {
            console.log('notebook exists and t is', t);
            t=1;
            }
            else
            { console.log('notebook doesnt exists and t is', t);
              t=0;
            }
             //  res.json('Creating and Updating notebooks');
        callback(t, notebookid);

      } else {
        error = new Error();
        error.code = response.statusCode;
        error.message = response.statusMessage;
        // The error body sometimes includes an empty space
        // before the first character, remove it or it causes an error.
        body = body.trim();
     //   error.innerError = JSON.parse(body).error;
        console.log(body, null);
      }
    });
  }).on('error', function (e) {
    console.log((e, null));
     res.json('Error occured');
  });

}




function getonenotearticles(token, callback)
{
    var options = {
    host: 'graph.microsoft.com',
    path: '/v1.0/me/onenote/pages?top=100&select=id,title&expand=parentSection(select=name),parentNotebook(select=name)',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  };

  https.get(options, function (response) {
    var body = '';
    response.on('data', function (d) {
      body += d;
    });
    response.on('end', function () {
      var error;
      if (response.statusCode === 200) {
            console.log(JSON.parse(body).value.length);
            var data = JSON.parse(body);
          
        callback(JSON.parse(body));

      } else {
        error = new Error();
        error.code = response.statusCode;
        error.message = response.statusMessage;
        // The error body sometimes includes an empty space
        // before the first character, remove it or it causes an error.
        body = body.trim();
     //   error.innerError = JSON.parse(body).error;
        console.log(body, null);
      }
    });
  }).on('error', function (e) {
    console.log((e, null));
     res.json('Error occured');
  });

}

function deleteonenotearticles(token, pageid , callback)
{
        var url = 'https://graph.microsoft.com/beta/me/onenote/pages/' + pageid;
        var options = {
        url: url,
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
        }
    };

    request(options, function (err, res, body) {
    if (err) {
        console.log('Failed to delete page', err)
        return
    }
    console.log('Deleted Page')
    callback('Deleted Page');
    });


}


function checksection(token , notebookid, modulename ,callback)
{   sec=0;
  console.log('Module name is' + modulename);
    var options = {
    host: 'graph.microsoft.com',
    path: '/beta/me/onenote/notebooks/'+ notebookid+ '/sections/?$select=displayName,id',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  };

  https.get(options, function (response) {
    var body = '';
    response.on('data', function (d) {
      body += d;
    });
    response.on('end', function () {
      var error;
      if (response.statusCode === 200) {
            console.log(JSON.parse(body).value.length);
            var data = JSON.parse(body);
            for(var i=0; i< data.value.length; i++)
            {
                console.log(data.value[i].displayName);
                if(data.value[i].displayName == modulename)
                {
                 sec=1;
                 sectionid = data.value[i].id;
                }
            }
            if(sec==1)
            {
            console.log('section exists and id is',sectionid ,'and sec is ' , sec );
            sec=1;
            }
            else
            { console.log('section doesnt exists and sec is ', sec);
              sec=0;
            }
             //  res.json('Creating and Updating notebooks');
        callback(sec, sectionid);

      } else {
        error = new Error();
        error.code = response.statusCode;
        error.message = response.statusMessage;
        // The error body sometimes includes an empty space
        // before the first character, remove it or it causes an error.
        body = body.trim();
     //   error.innerError = JSON.parse(body).error;
        console.log(body, null);
      }
    });
  }).on('error', function (e) {
    console.log((e, null));
  });

}




function checksection(token , notebookid, modulename ,callback)
{   sec=0;
  console.log('Module name is' + modulename);
    var options = {
    host: 'graph.microsoft.com',
    path: '/beta/me/onenote/notebooks/'+ notebookid+ '/sections/?$select=displayName,id',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  };

  https.get(options, function (response) {
    var body = '';
    response.on('data', function (d) {
      body += d;
    });
    response.on('end', function () {
      var error;
      if (response.statusCode === 200) {
            console.log(JSON.parse(body).value.length);
            var data = JSON.parse(body);
            for(var i=0; i< data.value.length; i++)
            {
                console.log(data.value[i].displayName);
                if(data.value[i].displayName == modulename)
                {
                 sec=1;
                 sectionid = data.value[i].id;
                }
            }
            if(sec==1)
            {
            console.log('section exists and id is',sectionid ,'and sec is ' , sec );
            sec=1;
            }
            else
            { console.log('section doesnt exists and sec is ', sec);
              sec=0;
            }
             //  res.json('Creating and Updating notebooks');
        callback(sec, sectionid);

      } else {
        error = new Error();
        error.code = response.statusCode;
        error.message = response.statusMessage;
        // The error body sometimes includes an empty space
        // before the first character, remove it or it causes an error.
        body = body.trim();
     //   error.innerError = JSON.parse(body).error;
        console.log(body, null);
      }
    });
  }).on('error', function (e) {
    console.log((e, null));
  });

}

function createsection(token, notebookid ,modulename ,callback)
{
      console.log(modulename);
     var url = 'https://graph.microsoft.com/beta/me/onenote/notebooks/' + notebookid + '/sections';
     console.log('url is ' + url);
            console.log('notebook id' , notebookid);
        var options = {
        url: 'https://graph.microsoft.com/beta/me/onenote/notebooks/' + notebookid + '/sections',
        method: 'POST',
        body : JSON.stringify({ "displayName" : modulename }),
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
        }
    };

    request(options, function (err, res, body) {
    if (err) {
        console.log('Post section Error :', err)
        return
    }
    console.log('Post section Body :', body, JSON.parse(body).id)
    sectionid = JSON.parse(body).id;
    callback(JSON.parse(body).id);
    });
}


function writespecific(token,topic,chapter ,callback)
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
            favourites = response.body;
            if(favourites.sections != undefined)
            {
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
               }
               else{
                  favourites= { title: 'Page does not exists: Error 404' };
                  url = url + "<p> Contact your School or Teacher</p>";
                  console.log('I come here when i get error' , favourites.title);
               }
                callback(url);
            
        });
        
       
     
    }


function writespecific2(token,topic,chapter, articleid ,studentid, moduleid,callback)
{
    getToken(function(token2){
    console.log('inside token' , topic,chapter , token, articleid ,studentid, moduleid);
    var url = '';
    var favourites = {};
    var headers = {
        "content-type": "application/json",
        Authorization: 'Bearer ' + token2 
    }
    var options = {
         url:'https://services.almanac-learning.com/composer/students/' + studentid + '/instances/'+ moduleid +'/articles/' + articleid + '/',
        method: 'GET',
        headers: headers,
    }
    console.log(options.url);
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          favourites = JSON.parse(response.body);
            console.log('response article' , response.body , favourites.sections);
            if(favourites.sections != undefined)
            {
            console.log(favourites.sections.length);
            for(var i=0; i< favourites.sections.length; i++) 
            {  
                    url = url + " <h3>Images from section "+ (i+1) + " are as under</h3>";
                    url = url + "<h4>" +  favourites.sections[i].text.text + "</h4>";
                    try{
                        var image_len = favourites.sections[i].images.length;
                    }
                    catch(err)
                    {    continue;  }
                    finally { }
                    for(var j=0; j< image_len;j++)
                    {
                      console.log('Image url is ',favourites.sections[i].images[j].url);
                    url = url+ "<p><img src=" + "\"" + favourites.sections[i].images[j].url + "\"" + "/><br>"+
                    favourites.sections[i].images[j].caption +  "</p><p>" + favourites.sections[i].images[j].attribution
                    + "</p>" ;
                    }
                }
               }
               else
               {
                  favourites= { title: 'Page does not exists: Error 404' };
                  url = url + "<p> Contact your School or Teacher</p>";
                  console.log('I come here when i get error' , favourites.title);
               }
                
        }
        else {
                  favourites= { title: 'Page does not exists: Error 404' };
                  url = url + "<p> Contact your School or Teacher</p>";
                  console.log('Error occured getting data' , error ,response.body,response.statusCode, response.headers);
               }
               callback(url);
    });

        });
       
     
    }


    function createarticle(token, topic, chapter ,articleid , studentid , moduleid)
    {
      
      writespecific2(token, topic, chapter ,articleid , studentid, moduleid,function(url)
      {
        var htmlPayload =
        "<!DOCTYPE html>" +
        "<html>" +
        "<head>" +
        "    <title>"+ topic +"</title>" +
        "    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\">" +
        "</head>" +
        "<body>" +
        "    <p> View Your Page <i>formatted</i></p>" +
         url +
        "</body>" +
        "</html>";   
        console.log('Payload is' , htmlPayload);
            
            createNewPage(token, htmlPayload, false); 

      });
       

    }

    
function getarticle(token, topic, chapter ,articleid , studentid, moduleid, callback)
{
  getToken(function(token2){
    var favourites ={};
var url = '';
var obj = [];
var counter =0;

    var headers = {
        "content-type": "application/json",
        Authorization: 'Bearer ' + token2 
    }
    var options = {
             url:'https://services.almanac-learning.com/composer/students/' + studentid + '/instances/'+ moduleid +'/articles/' + articleid + '/',
        method: 'GET',
        headers: headers,
    }
    console.log(options.url);
 request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
       //         console.log("post query" + response.body);
                favourites = JSON.parse(response.body);
       console.log('response article' , response.body.modes , favourites.modes);
            if(favourites.modes != undefined)
            {
            console.log('Modes length' ,favourites.modes.length);
            favourites.modes.forEach(function (mode)
            {
            for(var i=0; i< mode.sections.length; i++) 
            {
       
                    url = url + " <h3>Images from this section are as under</h3>";
                    url = url + "<h4>" +  mode.sections[i].text.text.substring(9, mode.sections[i].text.text.length-3 ) + "</h4>";
                    try{
                        var image_len = mode.sections[i].images.length;
                    }
                    catch(err)
                    {    continue;  }
                    finally { }
                    var x=0;
                    if(mode.sections[i].videos !== undefined)
                    if(mode.sections[i].videos.length > 0)
                    url = url + "<br><iframe width='340' height='280' data-original-src='https://www.youtube.com/watch?v=" + mode.sections[i].videos[0].url + "' /><br>" ;
                    for(var j=0; j< image_len;j++)
                    {
                        if(mode.sections[i].images[j].caption !==null)
                        {
                        mode.sections[i].images[j].caption = mode.sections[i].images[j].caption.substring(9,mode.sections[i].images[j].caption.length-3 );
                        }
                        else mode.sections[i].images[j].caption ='Caption '+ Math.floor((Math.random() * 1000) + 1);
                 //     console.log('Image url is ',favourites.sections[i].images[j].url);
                        if(mode.sections[i].images[j].attribution == 'Publisher')   // change name to stop check
                        {   
                        
                        console.log('Image attribute cj fallon found' ,mode.sections[i].images[j].attribution,mode.sections[i].images[j].url , 'i is ', i , 'j is' ,j);
                        var caption =  mode.sections[i].images[j].caption;
                        var fileurl = mode.sections[i].images[j].url + key;
                        var width =  mode.sections[i].images[j].width;
                        var attr = 'Publisher';
                          console.log('File url is' ,fileurl );
                          var details = {"attr" : attr , "fileurl" : fileurl , "width" : caption  };
                          obj.push(details);
                          x++;


                        }
                        else {
                    
                    url = url+ "<p><img src=" + "\"" + mode.sections[i].images[j].url + "\"" + "/><br>"+
                    mode.sections[i].images[j].caption +  "</p><p>Source:" + mode.sections[i].images[j].attribution
                    + "</p>" ;
                        }
                        url = url + '<br>';
                    }
                }
                })
               }
               callback(url , obj);
               
        }
        else { console.log('nuffing2 instances' , error ,response.statusCode, response.headers);
        callback(url , obj);
        }
    });
  });
}

// Old code for writing to file and reading the binary code of image
    function writer(token, topic, chapter ,articleid , studentid, moduleid,  callback)
    {   
   // var fulldata;
       getarticle(token, topic, chapter ,articleid , studentid, moduleid, function(data , obj){
           var  fulldata = data;
        //   console.log(fulldata);
           console.log('Object Length' ,obj.length);   
           if(obj.length >0)            
            obj.forEach(function(obj) {
         
            // url = url+ "<p><img src=" + "\"" + "data:image/jpeg;base64," + image + "\"" +  "/><br>" + width +  "</p>"  + "<p>Source:" + attr;
             writetofile(obj.width, obj.fileurl , function(result) {
                console.log('Result is' ,result);
                            decode(obj.width, function(image){
                                  console.log(' new creation is File url is' ,obj.fileurl, obj.width);
                                fulldata = fulldata +"<p><img src=" + "\"" + "data:image/jpeg;base64," + image + "\"" +  "/><br>" + obj.width +  "</p>"  + "<p>Source:" + obj.attr
                        + "</p>" ;
                     //   console.log(fulldata);
                            });
                     
                        });
                      
                        
               });
               setTimeout(function() {
                    fulldata = 
        "<!DOCTYPE html>" +
        "<html>" +
        "<head>" +
        "    <title>"+ topic + dateTimeNowISO() +"</title>" +
        "    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\">" +
        "</head>" +
        "<body>" +
        "    <p> View Your Saved Article <i>formatted</i></p>" +
         fulldata +
        "</body>" +
        "</html>";   
                                   callback(fulldata);
               }, obj.length * 700);
            
                      });
                      
}

   function writer2(token, topic, chapter ,articleid , studentid, moduleid,  callback)
    {   
   // var fulldata;
       getarticle2(token, topic, chapter ,articleid , studentid, moduleid, function(data , obj){

          console.log('data before match' , data ,'Object is' , obj);
              getToken(function(token2){
    var favourites ={};
var url = '';
var counter =0;

    var headers = {
        "content-type": "application/json",
        Authorization: 'Bearer ' + token2 
    }
    var options = {
             url:'https://services.almanac-learning.com/composer/students/' + studentid + '/instances/'+ moduleid +'/articles/' + articleid + '/',
        method: 'GET',
        headers: headers,
    }
    console.log(options.url);
 request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
       //         console.log("post query" + response.body);
                favourites = JSON.parse(response.body);
               var counter = 0;
       console.log('response article' , response.body.modes , favourites.modes );
            var x=0;
            if(favourites.modes != undefined)
            {
            console.log('Modes length' ,favourites.modes.length , obj.length);
             obj.forEach(function(obj) {
                  console.log(obj.fileurl);
             })
            favourites.modes.forEach(function (mode)
            {
            // for(var i=0; i< mode.sections.length; i++) 
            // {
              mode.sections.some(function(section)
              {
                  if(chapter == 'The States of Matter' && counter > 4)
                  {
                    console.log('BREAKING' , counter);
                  return true;
                }
                else counter++;
                  
                  url = url + "<h1>" + section.title + "</h1>";
                    url = url + "<h2>" +  section.text.text.substring(9, section.text.text.length-3 ) + "</h2>";
                     if(section.images !==  undefined)
                    url = url + " <h3>Images from this section are as under</h3>";
                    try{
                        var image_len = section.images.length;
                    }
                    catch(err)
                    {   // continue;  
                    }
                    finally { }
                    if(section.videos !== undefined)
                    if(section.videos.length > 0)
                    url = url + "<br><iframe width='340' height='280' data-original-src='https://www.youtube.com/watch?v=" + section.videos[0].url + "' /><br>" ;
                    if(section.images !== undefined)
                    section.images.forEach(function(image)
                    {
                        if(image.caption !==null)
                        {
                        image.caption = image.caption.substring(9,image.caption.length-3 );
                        }
                        else image.caption ='Caption '+ Math.floor((Math.random() * 1000) + 1);
                 //     console.log('Image url is ',favourites.sections[i].images[j].url);
                        if(image.attribution == 'Publisher')   // change name to stop check
                        {   

                       // console.log('Image attribute cj fallon found' ,image.attribution,image.url);
                        var caption =  image.caption;
                        var fileurl = image.url + key;
                        var width =  image.width;
                        var attr = 'Publisher';
                           if(obj.length >0)            
                               obj.some(function(obj) {
                                  
                                 if(obj.fileurl == fileurl)
                                 {
                                   console.log('matched');
                                  console.log('File url is' ,fileurl );
                                    url = url+ "<p><img src=" + "\"data:image/jpeg;base64," + obj.data + "\"" + "/><br>"+
                          obj.width +  "</p><p>Source:" + obj.attr
                          + "</p>" ;
                                  return true;
                                 }
                     
                               })

                        


                        }
                        else {
                    
                    url = url+ "<p><img src=" + "\"" + image.url + "\"" + "/><br>"+
                    image.caption +  "</p><p>Source:" + image.attribution
                    + "</p>" ;
                        }
                        url = url + '<br>';
                    })
             
                })
              })
               }
                callback(url);
        }
        else { console.log('nuffing2 instances' , error ,response.statusCode, response.headers);
      }
           
    });
        //  setTimeout(function() {
        //             fulldata = 
        // "<!DOCTYPE html>" +
        // "<html>" +
        // "<head>" +
        // "    <title>"+ topic + dateTimeNowISO() +"</title>" +
        // "    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\">" +
        // "</head>" +
        // "<body>" +
        // "    <p> View Your Saved Article <i>formatted</i></p>" +
        //  url +
        // "</body>" +
        // "</html>";   
                             
            //   }, 2000);
  });
      
                      });
                      
}

  function writer3(token, topic, chapter ,articleid , studentid, moduleid,  callback)
    {   

              getToken(function(token2){
    var favourites ={};
  var url = '';
  var counter =0;

    var headers = {
        "content-type": "application/json",
        Authorization: 'Bearer ' + token2 
    }
    var options = {
             url:'https://services.almanac-learning.com/composer/students/' + studentid + '/instances/'+ moduleid +'/articles/' + articleid + '/',
        method: 'GET',
        headers: headers,
    }
    console.log(options.url);
 request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
       //         console.log("post query" + response.body);
                favourites = JSON.parse(response.body);
       console.log('response article' , response.body.modes , favourites.modes);
            var x=0;
            if(favourites.modes != undefined)
            {
            console.log('Modes length' ,favourites.modes.length);
            favourites.modes.forEach(function (mode)
            {
            // for(var i=0; i< mode.sections.length; i++) 
            // {
              mode.sections.forEach(function(section)
              {
                  url = url + "<h1>" + section.title + "</h1>";
                    url = url + "<h2>" +  section.text.text.substring(9, section.text.text.length-3 ) + "</h2>";
                     if(section.images !==  undefined)
                    url = url + " <h3>Images from this section are as under</h3>";
                    try{
                        var image_len = section.images.length;
                    }
                    catch(err)
                    {   // continue;  
                    }
                    finally { }
                    if(section.videos !== undefined)
                    if(section.videos.length > 0)
                    url = url + "<br><iframe width='340' height='280' data-original-src='https://www.youtube.com/watch?v=" + section.videos[0].url + "' /><br>" ;
                    if(section.images !== undefined)
                    section.images.forEach(function(image)
                    {
                        if(image.caption !==null)
                        {
                        image.caption = image.caption.substring(9,image.caption.length-3 );
                        }
                        else image.caption ='Caption '+ Math.floor((Math.random() * 1000) + 1);
                 //     console.log('Image url is ',favourites.sections[i].images[j].url);
                        if(image.attribution == 'Publisher')   // change name to stop check
                        {   
                        
                        console.log('Image attribute cj fallon found' ,image.attribution,image.url);
                        var caption =  image.caption;
                        var fileurl = image.url + key;
                        var width =  image.width;
                        var attr = 'Publisher';
                          console.log('File url is' ,fileurl );
             
                    url = url+ "<p><img src=" + "\"" + fileurl + "\"" + "/><br>"+
                      image.caption +  "</p><p>Source:" + image.attribution
                    + "</p>" ;
                        }
                        else {
                    
                    url = url+ "<p><img src=" + "\"" + image.url + "\"" + "/><br>"+
                    image.caption +  "</p><p>Source:" + image.attribution
                    + "</p>" ;
                        }
                        url = url + '<br>';
                    })
                })
              })
               }
                callback(url);
        }
        else { console.log('nuffing2 instances' , error ,response.statusCode, response.headers);
      }
           
    });

  });
                                  
}

function encoder(url , callback)
{
  var request = require('request').defaults({ encoding: null });

request.get(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        data = new Buffer(body).toString('base64');
        console.log(url);
        callback(data);
    }
});
}


    
function getarticle2(token, topic, chapter ,articleid , studentid, moduleid, callback)
{
  getToken(function(token2){
    var favourites ={};
var url = '';
var obj = [];
var counter =0;

    var headers = {
        "content-type": "application/json",
        Authorization: 'Bearer ' + token2 
    }
    var options = {
             url:'https://services.almanac-learning.com/composer/students/' + studentid + '/instances/'+ moduleid +'/articles/' + articleid + '/',
        method: 'GET',
        headers: headers,
    }
    console.log(options.url);
 request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
       //         console.log("post query" + response.body);
                favourites = JSON.parse(response.body);
       console.log('response article' , response.body.modes , favourites.modes);
       var x=0;
            if(favourites.modes != undefined)
            {
            console.log('Modes length' ,favourites.modes.length);
            favourites.modes.forEach(function (mode)
            {
            // for(var i=0; i< mode.sections.length; i++) 
            // {
              mode.sections.forEach(function(section)
              {
                    url = url + " <h3>Images from this section are as under</h3>";
                    url = url + "<h4>" +  section.text.text.substring(9, section.text.text.length-3 ) + "</h4>";
                    try{
                        var image_len = section.images.length;
                    }
                    catch(err)
                    {   // continue;  
                    }
                    finally { }
                    if(section.videos !== undefined)
                    if(section.videos.length > 0)
                    url = url + "<br><iframe width='340' height='280' data-original-src='https://www.youtube.com/watch?v=" + section.videos[0].url + "' /><br>" ;
                    if(section.images !== undefined)
                    section.images.forEach(function(image)
                    {
                        if(image.caption !==null)
                        {
                        image.caption = image.caption.substring(9,image.caption.length-3 );
                        }
                        else image.caption ='Caption '+ Math.floor((Math.random() * 1000) + 1);
                 //     console.log('Image url is ',favourites.sections[i].images[j].url);
                        if(image.attribution == 'Publisher')   // change name to stop check
                        {   
                        
                      //  console.log('Image attribute cj fallon found' ,image.attribution,image.url);
                        var caption =  image.caption;
                        var fileurl = image.url + key;
                        var attr = 'Publisher';
                        //  console.log('File url is' ,fileurl );
                       
                        encoder(fileurl ,function(image)
                        {
                        //         url = url +"<p><img src=" + "\"" + "data:image/jpeg;base64," + image + "\"" +  "/><br>" + obj1.width +  "</p>"  + "<p>Source:" + obj1.attr
                        // + "</p>" ;
                               var obj1 = {"attr" : attr , "fileurl" : fileurl , "width" : caption , "data" : image };
                            obj.push(obj1);
                          x++;
                        });
                        }
                        else {
                    
                    // url = url+ "<p><img src=" + "\"" + image.url + "\"" + "/><br>"+
                    // image.caption +  "</p><p>Source:" + image.attribution
                    // + "</p>" ;
                        }
                 //       url = url + '<br>';
                    })
                })
              })
           //   setTimeout(function() {

            
            //  },favourites.modes.length * 4000 )
               }
                 callback(url , obj);
               
        }
        else { console.log('nuffing2 instances' , error ,response.statusCode, response.headers);
        callback(url , obj);
        }
    });
  });
}


    function createNewPage(accessToken, payload, multipart) {
            var options = {
                url: 'https://graph.microsoft.com/beta/me/onenote/sections/'+ sectionid  +'/pages',
                headers: {
                'Authorization': 'Bearer ' + accessToken
                }
            };
            // Build simple request
            if (!multipart) {
                options.headers['Content-Type'] = 'text/html';
                options.body = payload;
            }
            var r = request.post(options, function (err, resp, body) {
              if (err) {
                console.log('Error!');
              } else {
                console.log('Response is: ' + body);
              }
            });
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

    function createNewPage2(accessToken, payload, multipart,callback) {
    
            var options = {
                url: 'https://graph.microsoft.com/beta/me/onenote/sections/'+ sectionid  +'/pages',
                headers: {
                'Authorization': 'Bearer ' + accessToken
                }
            };
              console.log('here' , options.url );
               console.log(((payload.toString().length)-814)/1.37);    
            // Build simple request
            if (!multipart) {
                options.headers['Content-Type'] = 'text/html';
                options.body = payload;
            }
             var r = request.post(options, function (err, resp, body) {
              if (err) {
               console.log('Error!' , err);
                callback(err);
              } else {
                console.log('Response is: ' + body + resp);
                callback(body);
              }
            });
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

 function createOneNoteArticle(token, topic, chapter ,articleid , studentid , moduleid , callback) {


         writer2(token, topic, chapter ,articleid , studentid, moduleid,function(data){

           data  =
             "<!DOCTYPE html>" +
        "<html>" +
        "<head>" +
        "    <title>"+ chapter + " " + dateTimeNowISO() +"</title>" +
        "    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\">" +
        "</head>" +
        "<body>" +
        "    <p> View Your Saved Article <i>formatted</i></p>" +
         data +
        "</body>" +
        "</html>";   

        createNewPage2(token, data , false , function(response)
        {
            callback(JSON.parse(response));
        });
         });

    
    }

 function createOneNoteArticle2(token, topic, chapter ,articleid , studentid , moduleid) {


         writer3(token, topic, chapter ,articleid , studentid, moduleid,function(data){

           data  =
             "<!DOCTYPE html>" +
        "<html>" +
        "<head>" +
        "    <title>"+ chapter + " " + dateTimeNowISO() +"</title>" +
        "    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\">" +
        "</head>" +
        "<body>" +
        "    <p> View Your Saved Article <i>formatted</i></p>" +
         data +
        "</body>" +
        "</html>";   

        createNewPage2(token, data , false);
         });

}


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
        "    <title>"+ favourites.title +"&nbsp;</title>" +
        "    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\">" +
        "</head>" +
        "<body>" +
        "    <p> View Your Page <i>formatted</i></p>" +
         url +
        "</body>" +
        "</html>";   
            
            createPage(token, htmlPayload, false); 
        }, 2000);
     
    }
 
        function dateTimeNowISO() {             // replace T with a space
            return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');  // delete the dot and everything after
            }

    function createPage(accessToken, payload, multipart) {
            var options = {
                url: 'https://graph.microsoft.com/beta/me/onenote/pages',
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




function aboutmail(req,res)
{
    var options = {
    host: 'graph.microsoft.com',
    path: '/v1.0/me/messages',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + req.cookies.ACCESS_TOKEN_CACHE_KEY
    }
  };

  https.get(options, function (response) {
    var body = '';
    response.on('data', function (d) {
      body += d;
    });
    response.on('end', function () {
      var error;
      if (response.statusCode === 200) {
                console.log(JSON.parse(body));
                res.send(JSON.parse(body));
        //callback(null, JSON.parse(body));

      } else {
        error = new Error();
        error.code = response.statusCode;
        error.message = response.statusMessage;
        // The error body sometimes includes an empty space
        // before the first character, remove it or it causes an error.
        body = body.trim();
        error.innerError = JSON.parse(body).error;
        console.log(callback(error, null));
      }
    });
  }).on('error', function (e) {
    console.log((e, null));
  });

}

function renderSendMail(req, res) {
  requestUtil.getUserData(
    req.cookies.ACCESS_TOKEN_CACHE_KEY,
    function (firstRequestError, firstTryUser) {
      if (firstTryUser !== null) {
        req.session.user = firstTryUser;
        res.render(
          'sendMail',
          {
            display_name: firstTryUser.displayName,
            user_principal_name: firstTryUser.userPrincipalName
          }
        );
      } else if (hasAccessTokenExpired(firstRequestError)) {
        // Handle the refresh flow
        authHelper.getTokenFromRefreshToken(
          req.cookies.REFRESH_TOKEN_CACHE_KEY,
          function (refreshError, accessToken) {
            res.cookie(authHelper.ACCESS_TOKEN_CACHE_KEY, accessToken);
            if (accessToken !== null) {
              requestUtil.getUserData(
                req.cookies.ACCESS_TOKEN_CACHE_KEY,
                function (secondRequestError, secondTryUser) {
                  if (secondTryUser !== null) {
                    req.session.user = secondTryUser;
                    res.render(
                      'sendMail',
                      {
                        display_name: secondTryUser.displayName,
                        user_principal_name: secondTryUser.userPrincipalName
                      }
                    );
                  } else {
                    clearCookies(res);
                    renderError(res, secondRequestError);
                  }
                }
              );
            } else {
              renderError(res, refreshError);
            }
          });
      } else {
        renderError(res, firstRequestError);
      }
    }
  );
}

router.post('/', function (req, res) {
  var destinationEmailAddress = req.body.default_email;
  var mailBody = emailer.generateMailBody(
    req.session.user.displayName,
    destinationEmailAddress
  );
  var templateData = {
    display_name: req.session.user.displayName,
    user_principal_name: req.session.user.userPrincipalName,
    actual_recipient: destinationEmailAddress
  };

  requestUtil.postSendMail(
    req.cookies.ACCESS_TOKEN_CACHE_KEY,
    JSON.stringify(mailBody),
    function (firstRequestError) {
      if (!firstRequestError) {
        res.render('sendMail', templateData);
      } else if (hasAccessTokenExpired(firstRequestError)) {
        // Handle the refresh flow
        authHelper.getTokenFromRefreshToken(
          req.cookies.REFRESH_TOKEN_CACHE_KEY,
          function (refreshError, accessToken) {
            res.cookie(authHelper.ACCESS_TOKEN_CACHE_KEY, accessToken);
            if (accessToken !== null) {
              requestUtil.postSendMail(
                req.cookies.ACCESS_TOKEN_CACHE_KEY,
                JSON.stringify(mailBody),
                function (secondRequestError) {
                  if (!secondRequestError) {
                    res.render('sendMail', templateData);
                  } else {
                    clearCookies(res);
                    renderError(res, secondRequestError);
                  }
                }
              );
            } else {
              renderError(res, refreshError);
            }
          });
      } else {
        renderError(res, firstRequestError);
      }
    }
  );
});

function hasAccessTokenExpired(e) {
  var expired;
  if (!e.innerError) {
    expired = false;
  } else {
    expired = e.code === 401 &&
      e.innerError.code === 'InvalidAuthenticationToken' &&
      e.innerError.message === 'Access token has expired.';
  }
  return expired;
}

function clearCookies(res) {
  res.clearCookie(authHelper.ACCESS_TOKEN_CACHE_KEY);
  res.clearCookie(authHelper.REFRESH_TOKEN_CACHE_KEY);
}

function renderError(res, e) {
  res.render('error', {
    message: e.message,
    error: e
  });
}

var decodedImage='';

var dest = 'file.jpg';

function writetofile(filename, url,callback)
{
  var buf = new Buffer(1024);
var file = fs.createWriteStream(filename + ".jpg");
// Setting http to be the default client to retrieve the URI.
var client = http;
// You can use url.protocol as well 
if (url.toString().indexOf("https") === 0){
            client = https;
}
var request = client.get(url, function(response) {
  response.pipe(file);
  file.on('close', function() { 
  console.log('There will be no more data.');
    callback(url);
});
//    fs.open(filename + '.jpg', 'r+', function(err, fd) {
//    if (err) {
//       return console.error(err);
//    }
//    console.log("File opened successfully!");
//    console.log("Going to read the file");
   
//    fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){
//       if (err){
//          console.log(err);
//       }

//       // Print only read bytes to avoid junk.
//       if(bytes > 0){
//          console.log(buf.slice(0, bytes).toString());
//       }

//       // Close the opened file.
//       fs.close(fd, function(err){
//          if (err){
//             console.log(err);
//          } 
//          console.log("File closed successfully.");
//           callback(url);
//       });
//    });
// });
  
});

}



function decode(filename , callback)
{

fs.readFile(filename+'.jpg', function(err, data) {
  if (err) throw err;
//  console.log('raw data is' , data);
  // Encode to base64
       var encodedImage = new Buffer(data, 'binary').toString('base64');

  // Decode from base64
  decodedImage = new Buffer(encodedImage, 'base64').toString('binary');

  
  callback(encodedImage);
  //deletefile(filename);
    });
        
 
}

function deletefile(filename)
{
     fs.unlink(filename + '.jpg', function(err) {
   if (err) {
      return console.error(err);
   }
   console.log("File deleted successfully!" + filename);
})
}



module.exports = router ;
