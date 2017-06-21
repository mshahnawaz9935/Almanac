const express = require('express');
const router = express.Router();
var request=require('request');
var MongoClient = require('mongodb').MongoClient , format = require('util').format;
var User     = require('../models/user');
var mongoose   = require('mongoose');
var session = require('express-session');


mongoose.connect('mongodb://remotemongodb:J3gcFVlTzb4KznFQ8Rbsz7V7cEROONHgSQMXkyI8wswQ41afGnkEvkn1iYmT01ktjvCH1FLOSYiaQi0t893rNw==@remotemongodb.documents.azure.com:10250/?ssl=true');


   // mongoose.connect('mongodb://127.0.0.1:27017/test');
console.log('Api running check');
  var token = '';
router.get('/token', (req, res) => {

    getToken(function (t)
    {
        console.log(t);
        token = t;
        res.json('ToKEN IS' + t);
    })

});

router.get('/getdata', (req, res) => {

  MongoClient.connect('mongodb://remotemongodb:J3gcFVlTzb4KznFQ8Rbsz7V7cEROONHgSQMXkyI8wswQ41afGnkEvkn1iYmT01ktjvCH1FLOSYiaQi0t893rNw==@remotemongodb.documents.azure.com:10250/?ssl=true', function (err, db) {        //Run mongodb and its service mongod.exe
  // MongoClient.connect('mongodb://127.0.0.1:27017/test',function(err, db) {
    if (err) {
        throw err;
    } else {
        console.log("successfully connected to the database");
    }
    db.close();
});
MongoClient.connect('mongodb://remotemongodb:J3gcFVlTzb4KznFQ8Rbsz7V7cEROONHgSQMXkyI8wswQ41afGnkEvkn1iYmT01ktjvCH1FLOSYiaQi0t893rNw==@remotemongodb.documents.azure.com:10250/?ssl=true', function(err, db) {
  // MongoClient.connect('mongodb://127.0.0.1:27017/test',function(err, db) {
    if(err) throw err;

     var collection = db.collection('test');
    // collection.insert({a:2}, function(err, docs) {
    //     collection.count(function(err, count) {
    //         console.log(format("count = %s", count));
    //     });
    // });

    // Locate all the entries using find
    console.log(req.session.email);
    collection.find({"username":req.session.email}).toArray(function(err, results) {
        console.dir(results);
        // Let's close the db
          res.json(results );
        db.close();
    });
});


});

router.get('/search', (req, res) => {
//       username = "almanac",
//     password = "a1m*Nac";
//     var request = require('request');
// var options = {
//   url: 'http://kdeg-vm-43.scss.tcd.ie/cjfallon/',
//   auth: {
//     user: username,
//     password: password
//   }
// }

// request(options, function (err, res, body) {
//   if (err) {
//     console.dir(err)
//     return
//   }
//   console.dir('headers', res.headers)
//   console.dir('status code', res.statusCode)
//   console.dir(body)
// })

  var id = req.query.id;
  var moduleid = req.query.moduleid;
  req.session.moduleid = moduleid;
  console.log('id is ' + id);

    // request.get('http://kdeg-vm-43.scss.tcd.ie/ALMANAC_Personalised_Composition_Service/composer/search2?query='+ id,function(err,response,body){
    //     console.log(response.body);
    // res.send(response.body);
    // });
    //  request.get('http://services.almanac-learning.com/personalised-composition-service/composer/students/5922b40c74748a1b1c8e4408/instances/5922b42274748a1b1c8e440f/articles?searchQuery=' + id+ '&differentiator=None',function(err,response,body){
    //     console.log(response.body);
    // res.send(response.body);
    // });
    // getToken(function(token)
    // {   

    var request = require('request');
    var headers = {
        Authorization: 'Bearer ' + token
    }
    var options = {
        url: 'http://services.almanac-learning.com/personalised-composition-service/composer/students/'+ req.session.studentid +'/instances/'+ moduleid +'/articles?searchQuery=' + id+ '&differentiator=None&type=Web',
        method: 'GET',
        headers: headers,
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('Results are' , JSON.parse(response.body));
            res.send(response.body);
        }
        else console.log('nuffing' , error ,response.statusCode, response.headers);
    })

    // });


});

function subscription(token , email , callback){

if(email == 'SHAHNAWM@tcd.ie')
email = 'shahnawm@tcd.ie';
console.log('Email is ' + email + 'Token is' + token);

 var exists = false;
 var request = require('request');
    var headers = {
        Authorization: 'Bearer ' + token
    }
    var options = {
        url: 'http://services.almanac-learning.com/personalised-composition-service/composer/students/' + email,
        method: 'GET',
        headers: headers,
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('Results found', JSON.parse(response.body));
            if(JSON.parse(response.body).email == email)
            {
            exists = true;
            callback(exists , JSON.parse(response.body).id );
        }
        else {
            exists = false;
            callback(exists , '');
        }
        
        }
        else
        { console.log('nuffing email' , email, error ,response.statusCode, response.headers);
            callback(false , '');
        }
    });
}


router.get('/subscription', (req, res) => {

subscription( token , req.session.email , function(exists , id)
{
    if(exists == true)
    res.json('Subscription exists and id is' + id);
    else res.json('Subscription does not exists');
})

   



});




router.get('/instances', (req, res) => {

    // getToken(function(token)
    // {   
    console.log('Session email is' , req.session.email);
    subscription( token , req.session.email , function(exists , id)
{
    if(exists == true && id!== '')
    {
        req.session.studentid = id;
         var request = require('request');
    var headers = {
        Authorization: 'Bearer ' + token
    }
    var options = {
        url: 'http://services.almanac-learning.com/personalised-composition-service/composer/students/'+ id +'/instances',
        method: 'GET',
        headers: headers,
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('Instances', JSON.parse(response.body));
            res.json(JSON.parse(response.body));
        }
        else console.log('nuffing2 instances' , error ,response.statusCode, response.headers);
    });
    }
    
    else res.json('Subscription does not exists');

   

    });


});

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


router.get('/posts', (req, res) => {


console.log('Post token ' + token);
var topic = req.query.topic;
var chapter = req.query.chapter;
var moduleid = req.query.moduleid;
var modulename = req.query.modulename;
var articleid =req.query.articleid;

req.session.topic = topic;
req.session.chapter = chapter;
req.session.moduleid = moduleid;
req.session.modulename = modulename;
req.session.articleid = articleid;

// request({
//  //   url: "http://kdeg-vm-43.scss.tcd.ie/ALMANAC_Personalised_Composition_Service/composer/atomiccompose",
//     url:"http://services.almanac-learning.com/personalised-composition-service/composer/students/" + req.session.studentid + " /instances/"+ req.session.moduleid +"/articles/" + req.session.articleid,
//     method: "GET",
//     json: true,   // <--Very important!!!
//  //   body: queryObject,
//      headers: {
//         "content-type": "application/json",  // <--Very important!!!
//         "Authorization": "Bearer "+ token
//     },
// }, function (error, response, body){

//     console.log("post query" + response.body);
//       favourites = response.body;
//       console.log('Topic is ' + req.session.topic + 'Chapter is ' + req.session.chapter + 'Module Name is '+ req.session.moduleid
//       + 'Module Id is ' + req.session.modulename + 'Article id is' + req.session.articleid + 'Student id is' + req.session.studentid );
//         res.send(response.body) +  req.session.topic;
    
// });

    var headers = {
        "content-type": "application/json",
        Authorization: 'Bearer ' + token 
    }
    var options = {
         url:'http://services.almanac-learning.com/personalised-composition-service/composer/students/' + req.session.studentid + '/instances/'+ req.session.moduleid +'/articles/' + req.session.articleid + '/',
        method: 'GET',
        headers: headers,
    }
    console.log(options.url);
 request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
                console.log("post query" + response.body);
                favourites = response.body;
                console.log('Topic is ' + req.session.topic + 'Chapter is ' + req.session.chapter + 'Module Name is '+req.session.moduleid + 'Module Id is ' + req.session.modulename + 'Article id is' + req.session.articleid + 'Student id is' + req.session.studentid );
            res.send(response.body) +  req.session.topic;
        }
        else console.log('nuffing2 instances' , error ,response.statusCode, response.headers);
    });
});


router.get('/store', (req, res) => {

    // MongoClient.connect('mongodb://remotemongodb:J3gcFVlTzb4KznFQ8Rbsz7V7cEROONHgSQMXkyI8wswQ41afGnkEvkn1iYmT01ktjvCH1FLOSYiaQi0t893rNw==@remotemongodb.documents.azure.com:10250/?ssl=true',
      MongoClient.connect('mongodb://127.0.0.1:27017/test',
      function(err, db) {
          console.log('connected');
    if(err) throw err;

     var collection = db.collection('test');

     favourites['username']= req.session.email;
          console.log('sdssd' + favourites.title + favourites.username);
    collection.insert(favourites, function(err, docs) {
        collection.count(function(err, count) {
            console.log(format("count = %s", count));
        });
    });

    // Locate all the entries using find
    collection.find().toArray(function(err, results) {
        console.dir(results);
        // Let's close the db
         // res.json(results );
        db.close();
    });
});
console.log('inside');

res.json('favourites stored');
});

router.route('/users')

     // the URL is  http://localhost:8080/api/users
    .post(function(req, res) {
        
        var user = new User();      // create a new instance of the User model
        user.name = req.body.name;
        user.phone = req.body.phone;  // set the User name (comes from the request)

        // save the user and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });
        
    })
     .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    })
    
      


    router.route('/users/:user_name')                 //change accordingly either to user or id

    

           .put(function(req, res) {

        // use our user model to find the user we want
        User.findById(req.params.user_name, function(err, user) {

            if (err)
                res.send(err);

            user.name = req.body.name;  

            user.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'User updated!' });
            });

            })
         })
            .delete(function(req, res) {

                User.remove(
                    {
                    name: req.params.user_name
                }, 
                function(err, user) {
                    if (err)
                        res.send(err);

                    res.json(
                        { message: 'Successfully deleted' }
                        );
                });
            })
    
module.exports =  router;