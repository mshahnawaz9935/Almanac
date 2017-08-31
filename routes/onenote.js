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

var t=2,sec=2;
var notebookid;
var sectionid;
// SAS KEY
var key = '?sv=2016-05-31&ss=bfqt&srt=sco&sp=rc&se=2018-04-23T22:53:50Z&st=2017-07-20T14:53:50Z&spr=https&sig=AhAPJr%2BBr5urTfnfBKaF2hnIkpS1xEUCbekiNZW4Od4%3D';

function getToken (callback)                // Get token from Azure AD
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

router.get('/userlogin', (req, res) => {            // Login using Mongodb

    var username = req.query.username;
    var password = req.query.password;
    MongoClient.connect('mongodb://remotemongodb:J3gcFVlTzb4KznFQ8Rbsz7V7cEROONHgSQMXkyI8wswQ41afGnkEvkn1iYmT01ktjvCH1FLOSYiaQi0t893rNw==@remotemongodb.documents.azure.com:10250/?ssl=true', function (err, db) {        //Run mongodb and its service mongod.exe
  // MongoClient.connect('mongodb://127.0.0.1:27017/userdata',function(err, db) {
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
                      res.cookie(authHelper.sessionemail, req.session.email);  // Storing email in session
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


router.get('/checknote4', function (req, res) {          // Route to create OneNote Notebooks sections and articles

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


function createnotebook(token ,callback)           //Creates Notebook
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


router.get('/checklogin', function (req, res) {        // TO Check the session data and user login
  // check for token
  // if (req.cookies.ACCESS_TOKEN_CACHE_KEY === undefined) {  // for testing its very important to neutralize session
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

function checknote2(token, callback)                  //Checks for notebook named TCD Almanac
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




function getonenotearticles(token, callback)              // Get stored OneNote articles 
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



//Method for converting and generating binary data for OneNote
   function writer2(token, topic, chapter ,articleid , studentid, moduleid,  callback)
    {   
   // var fulldata;
       getarticle2(token, topic, chapter ,articleid , studentid, moduleid, function(data , obj){

          console.log('data before match' , data ,'Object is' , obj);
              getToken(function(token2){
    var favourites ={};
    var videos2=[];
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
               var images_size = 0;
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
                // //   if(chapter == 'The States of Matter' && counter > 2)
                // //   {
                // //     console.log('BREAKING' , counter);
                // //   return true;
                // // }
                // else counter++;
                  
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
                    {
                      if(videos2.length == 0)
                      {
                        videos2.push(section.videos[0].url);
                           url = url + "<br><iframe width='340' height='280' data-original-src='https://www.youtube.com/watch?v=" + section.videos[0].url + "' /><br>" ;
                      }
                      else
                      {
                      var match= false;
                      section.videos.some(function(vid)
                      {
                        var x= 0;
                          videos2.some(function(video) {
                            if(vid.url !== video)
                            {
                                x++;
                            }
                            
                            
                          });
                          if(x== videos2.length)
                          {
                             videos2.push(vid.url);
                             url = url + "<br><iframe width='340' height='280' data-original-src='https://www.youtube.com/watch?v=" + vid.url + "' /><br>" ;
                             return true;
                          }

                      })
                    }

                  
                    }
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
                                  
                                  console.log('File size is', ((obj.data.toString().length-814)/1.37)/1000);
                                  if(((obj.data.toString().length-814)/1.37)/1000 < 500 && images_size < 1500)
                                  {
                                     console.log('matched');
                                      console.log('File url is' ,fileurl );
                                      images_size = images_size + ((obj.data.toString().length-814)/1.37)/1000;
                                      if(images_size < 1500)
                                    url = url+ "<p><img src=" + "\"data:image/jpeg;base64," + obj.data + "\"" + "/><br>"+
                          obj.width +  "</p><p>Source:" + obj.attr
                          + "</p>" ;
                                  }
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
               console.log('Image sizes are' , images_size);
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

  function dateTimeNowISO() {             // replace T with a space
            return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');  // delete the dot and everything after
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
