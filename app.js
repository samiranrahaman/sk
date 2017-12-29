var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bodyParser = require('body-parser')

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 

var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };       
 


 var mongodbUri = 'mongodb://samiran1109:samiran@ds029456.mlab.com:29456/samirandb';
 mongoose.connect(mongodbUri, options);
var conn = mongoose.connection; 

var dbCollection = conn.collections;            
 
conn.on('error', console.error.bind(console, 'connection error:'));  
 
conn.once('open', function() {
					// Wait for the database connection to establish, then start the app.
  console.log('wait111.......................'); 
				  
				 var schema = new Schema({
					 _id:Number,
					 name: String,
					 point:Number,
					 folder:String,
					 stat:String
					 
				}); 

				// our model
				 var A = mongoose.model('A', schema);
				     
			});



app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  //res.sendFile(path.join(__dirname, 'views/index.html'));
  res.sendFile(path.join(__dirname, 'views/skydock/index.html'));
 
});
/* app.get('/list', function(req, res){

 res.sendFile(path.join(__dirname, 'views/list.html'));
 
  
}); */
app.get('/admin', function(req, res){

 res.sendFile(path.join(__dirname, 'views/admin/index.html'));
  
});
/* app.post('/admin', function(req, res){
console.log('sam.......................'); 
 
console.log(req.body.user.name);
 
}); */
// POST /login gets urlencoded bodies
app.post('/admin', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  //res.send('welcome, ' + req.body.username);
    //var datum = Date.parse(req.body.starttime);
	//var starttime_tm=datum/1000;
	
	//var datum2 = Date.parse(req.body.endtime);
	//var endtime_tm=datum2/1000;
   //console.log(datum/1000);
 /*  
mongoose.connection.db.collection('skydock').insert({
    "name": req.body.vessel,
    "prod": req.body.prod,
    "vol": req.body.vol,
    "rate": req.body.rate,
    "berth": req.body.berth,
    "fromdate":req.body.starttime,
    "todate": req.body.endtime,
    "span": "120",
    "values": [
        {
            "from": "/Date("+starttime_tm+")/",
            "to": "/Date("+endtime_tm+")/",
            "label": req.body.prod,
            "customClass": "ganttRed"
        }
    ]
});
*/



 mongoose.connection.db.collection('skydock').insert({
	 "tripid": "TaskId",
    "name": req.body.vessel,
    "prod": req.body.prod,
    "vol": req.body.vol,
    "rate": req.body.rate,
    "berth": req.body.berth,
    "fromdate":req.body.starttime,
    "todate": req.body.endtime,
    "span": "120"
});  

mongoose.connection.db.collection("skydata", function(err, collection){
										collection.find({'berth':req.body.berth }).toArray(function(err, finddata){
										     // it will print your collection data
											if(finddata.length>0)
											{
												console.log(finddata);
												mongoose.connection.db.collection('skydata').update(
												   {"berth" : req.body.berth },
												   { $push : {  "values": 
														{
															"from": req.body.starttime,
															"to": req.body.endtime,
															"label": req.body.prod,
															"customClass":req.body.priority
														}
													}
												   }
												);
											}
											else
											{
												console.log("2");
												 mongoose.connection.db.collection('skydata').insert({
    
													"berth": req.body.berth,
													"values": [
														{
															"from": req.body.starttime,
															"to": req.body.endtime, 
															"label": req.body.prod,
															"customClass":req.body.priority
														}
													]
												}); 
											}
										})
									  
									  });




  


res.redirect('/');

});

app.get('/skydock_schudle', function(req, res){


  mongoose.connection.db.collection("skydock", function(err, collection){
        collection.find({}).toArray(function(err, data){
           // console.log(data); // it will print your collection data
			res.send(data);
        })
    });

  
});

app.get('/skydock_schudle_chart', function(req, res){


  mongoose.connection.db.collection("skydata", function(err, collection){
        collection.find({}).toArray(function(err, data){
           // console.log(data); // it will print your collection data
			res.send(data);
        })
    });

  
});



app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});
