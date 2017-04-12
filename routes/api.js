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

module.exports = router;