const express = require('express');
const router = express.Router();
var request=require('request');
var MongoClient = require('mongodb').MongoClient , format = require('util').format;

/* GET api listing. */
router.get('/getdata', (req, res) => {

  MongoClient.connect('mongodb://127.0.0.1:27017/test', function (err, db) {
    if (err) {
        throw err;
    } else {
        console.log("successfully connected to the database");
    }
    db.close();
});
MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;

     var collection = db.collection('test');
    // collection.insert({a:2}, function(err, docs) {
    //     collection.count(function(err, count) {
    //         console.log(format("count = %s", count));
    //     });
    // });

    // Locate all the entries using find
    collection.find().toArray(function(err, results) {
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

    request.get('http://kdeg-vm-43.scss.tcd.ie:7080/ALMANAC_Personalised_Composition_Service/composer/search2?query='+ id,function(err,response,body){
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
  var request = require('request');
request({
    url: "http://kdeg-vm-43.scss.tcd.ie:7080/ALMANAC_Personalised_Composition_Service/composer/atomiccompose",
    method: "POST",
    json: true,   // <--Very important!!!
    body: queryObject,
     headers: {
        "content-type": "application/json",  // <--Very important!!!
    },
}, function (error, response, body){
    console.log("post query" + response.body);
        res.send(response.body);
});
});

module.exports = router;