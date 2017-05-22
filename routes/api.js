const express = require('express');
const router = express.Router();
var request=require('request');
var MongoClient = require('mongodb').MongoClient , format = require('util').format;
var User     = require('../models/user');
var mongoose   = require('mongoose');
var session = require('express-session');


mongoose.connect('mongodb://remotemongodb:J3gcFVlTzb4KznFQ8Rbsz7V7cEROONHgSQMXkyI8wswQ41afGnkEvkn1iYmT01ktjvCH1FLOSYiaQi0t893rNw==@remotemongodb.documents.azure.com:10250/?ssl=true');

 //   mongoose.connect('mongodb://127.0.0.1:27017/test');


/* GET api listing. */
var favourites ={};
router.get('/getdata', (req, res) => {

  MongoClient.connect('mongodb://remotemongodb:J3gcFVlTzb4KznFQ8Rbsz7V7cEROONHgSQMXkyI8wswQ41afGnkEvkn1iYmT01ktjvCH1FLOSYiaQi0t893rNw==@remotemongodb.documents.azure.com:10250/?ssl=true', function (err, db) {        //Run mongodb and its service mongod.exe
    if (err) {
        throw err;
    } else {
        console.log("successfully connected to the database");
    }
    db.close();
});
MongoClient.connect('mongodb://remotemongodb:J3gcFVlTzb4KznFQ8Rbsz7V7cEROONHgSQMXkyI8wswQ41afGnkEvkn1iYmT01ktjvCH1FLOSYiaQi0t893rNw==@remotemongodb.documents.azure.com:10250/?ssl=true', function(err, db) {
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
 

// var text = [{ id : 'dublintechsummit'  ,facebook : 'dublintechsummit' , twitter : 'DubTechSummit', tags : 'DublinTechSummit'  } ,
//  { id: 'microsoft' ,facebook : 'MicrosoftUK' , twitter : 'Microsoft', tags : 'Microsoft' }, // tags stand for twitter_hash tags
//     { id: 'linkedin' ,facebook : 'Linkedin' , twitter : 'Linkedin', tags : 'Linkedin' },
//     { id:'cnn' ,facebook : 'cnn' , twitter: 'CNN', tags : 'CNN' } ];
 //var query = text[0];  //Default is set to DublinTechSummit

  var id = req.query.id;
//   var flag = 0;
//   for(var i=0; i < text.length;i++)
//   {
//   if(id == text[i].id )
//   flag = i;
//   }
//   query = text[flag];
  console.log('id is ' + id);

    request.get('http://kdeg-vm-43.scss.tcd.ie/ALMANAC_Personalised_Composition_Service/composer/search2?query='+ id,function(err,response,body){
        console.log(response.body);
    res.send(response.body);
    });

});

router.get('/posts', (req, res) => {
var topic = req.query.topic;
var chapter = req.query.chapter;
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
req.session.topic = topic;
req.session.chapter = chapter;

request({
    url: "http://kdeg-vm-43.scss.tcd.ie/ALMANAC_Personalised_Composition_Service/composer/atomiccompose",
    method: "POST",
    json: true,   // <--Very important!!!
    body: queryObject,
     headers: {
        "content-type": "application/json",  // <--Very important!!!
    },
}, function (error, response, body){

     console.log('sdssd2' + response.body);
    console.log("post query" + response.body);
      favourites = response.body;
      console.log('Topic is ' + req.session.topic + 'Chapter is ' + req.session.chapter);
        res.send(response.body) +  req.session.topic;
    
});
});


router.get('/store', (req, res) => {

     MongoClient.connect('mongodb://remotemongodb:J3gcFVlTzb4KznFQ8Rbsz7V7cEROONHgSQMXkyI8wswQ41afGnkEvkn1iYmT01ktjvCH1FLOSYiaQi0t893rNw==@remotemongodb.documents.azure.com:10250/?ssl=true',
  //     MongoClient.connect('mongodb://127.0.0.1:27017/test',
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
    


module.exports = router;