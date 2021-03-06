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
 


 //var mongodbUri = 'mongodb://samiran1109:samiran@ds029456.mlab.com:29456/samirandb';
 var mongodbUri = 'mongodb://fitdrill:B3HZW0Ta#G@172.93.55.218/skydock';
 
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
app.get('/list', function(req, res){

 res.sendFile(path.join(__dirname, 'views/admin/list.html'));
 
  
}); 
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
 
    var IMEX =req.body.IMEX;
	console.log(IMEX);
	var vol=req.body.vol;
	var rate=req.body.rate;
	var cal=(parseInt(vol)/parseInt(rate)) + 4;
	var h_diff=Math.round(cal);
	console.log(cal);
	console.log(h_diff);
	
	var startdate=req.body.starttime;
	
	console.log(startdate);
	
	  var date = new Date(startdate);
	  date.setHours(date.getHours() + h_diff);
	  var endDate =date.toString();
	  console.log(date);
	  var endDate_string=""+(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
	  console.log(endDate_string);
	
      var datum = Date.parse(req.body.starttime);
	 //var starttime_tm=datum/1000;
	 var starttime_tm=datum;
	
	 var datum2 = Date.parse(endDate_string);
	 //var endtime_tm=datum2/1000;
	 var endtime_tm=datum2;
	 //console.log(starttime_tm);
     console.log(endtime_tm); 
	 
	   /* function diff_hours(dt2, dt1) 
		 {

		  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
		  diff /= (60 * 60);
		  //return Math.abs(Math.round(diff));
		  return Math.abs(diff);
		 }
		dt1 = new Date(req.body.starttime); 
		dt2 = new Date(req.body.endtime); 
		var h_diff=diff_hours(dt1, dt2);
		console.log(h_diff);
		var days = (parseInt)(h_diff/24)
		//console.log(days);
		var hours = (parseInt)(h_diff%24)
		console.log(hours);
		
		var  integr = Math.floor(h_diff);
		var decimal = h_diff - integr; 
		var min=Math.round(decimal*60);
		console.log(integr);
	   console.log(decimal);
	   console.log(min);
		var span=days+","+hours +":"+min; */
		
		
		var days = (parseInt)(h_diff/24)
		//console.log(days);
		var hours = (parseInt)(h_diff%24)
		console.log(hours);
		
		var  integr = Math.floor(h_diff);
		var decimal = h_diff - integr; 
		var min=Math.round(decimal*60);
		console.log(integr);
	   console.log(decimal);
	   console.log(min);
		var span=days+","+hours +":"+min;
		
		var dataObj=new Date();
		var timestamp=Date.parse(dataObj);
		
	 
 mongoose.connection.db.collection('skydock').insert({
	 "tripid": "#"+timestamp,
    "name": req.body.vessel,
    "prod": req.body.prod,
    "vol": req.body.vol,
    "rate": req.body.rate,
    "berth": req.body.berth,
    "fromdate":req.body.starttime,
    "todate": endDate_string,
    "span": span,
	"timestamp":timestamp,
	"IMEX":IMEX,
	"fromdatesearch":new Date(req.body.starttime)
});  

if(req.body.berth=="2"){ var order=1;}
if(req.body.berth=="6A"){ var order=2;}
if(req.body.berth=="6B"){ var order=3;}
if(req.body.berth=="7A"){ var order=4;}
if(req.body.berth=="7B"){ var order=5;}
if(req.body.berth=="NS"){ var order=6;}
if(req.body.berth=="PNT"){ var order=7;}

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
															//"from": req.body.starttime,
															//"to": req.body.endtime,
															"from": "/Date("+starttime_tm+")/",
                                                            "to": "/Date("+endtime_tm+")/",
															"label": req.body.vessel,
															"customClass":req.body.priority,
															"dataObj":
																	{
																		"id":timestamp,
																		"berth": req.body.berth,
																		"h_diff":h_diff
																	},
															"timestamp":timestamp,
															"fromdate":req.body.starttime,
															"fromdatesearch":new Date(req.body.starttime),
															"todate": endDate_string
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
													"order": order,
													"values": [
														{
															//"from": req.body.starttime,
															//"to": req.body.endtime, 
															"from": "/Date("+starttime_tm+")/",
															"to": "/Date("+endtime_tm+")/",
															"label": req.body.vessel,
															"customClass":req.body.priority,
															"dataObj":
																	{
																		"id":timestamp,
																		"berth": req.body.berth,
																		"h_diff":h_diff
																	},
															"timestamp":timestamp,
															"fromdate":req.body.starttime,
															"fromdatesearch":new Date(req.body.starttime),
															"todate": endDate_string
														}
													]
												}); 
											}
										})
									  
									  }); 


 

  


 res.redirect('/list');

});

app.get('/skydock_schudle/:search_start_date/:search_end_date', function(req, res){


  
	
var search_start_date= req.params.search_start_date;
var search_end_date= req.params.search_end_date;
//console.log(search_start_date);
//console.log(search_end_date);
var search_start_date_1=new Date (parseInt(search_start_date));
var search_start_date_1_string=""+(search_start_date_1.getMonth()+1)+"/"+search_start_date_1.getDate()+"/"+search_start_date_1.getFullYear()+" "+search_start_date_1.getHours()+":"+search_start_date_1.getMinutes();

var search_end_date_1=new Date (parseInt(search_end_date));
var search_end_date_1_string=""+(search_end_date_1.getMonth()+1)+"/"+search_end_date_1.getDate()+"/"+search_end_date_1.getFullYear()+" "+search_end_date_1.getHours()+":"+search_end_date_1.getMinutes();
console.log(search_start_date_1_string);
console.log(search_end_date_1_string);

	  
  /* mongoose.connection.db.collection("skydock", function(err, collection){
        //collection.find({}).toArray(function(err, data){
		 collection.find({ fromdatesearch: { $gte: search_start_date_1_string, $lte: search_end_date_1_string } }).toArray(function(err, data){
           // console.log(data); // it will print your collection data
			res.send(data);
        })
    }); */
   
   mongoose.connection.db.collection("skydock", function(err, collection){
        //collection.find({}).toArray(function(err, data){
		 collection.aggregate([
        //Pre-filter to have data arrays with at least one matching date
	{$match:{ 'fromdatesearch': {$gte: new Date(search_start_date_1_string), $lte: new Date(search_end_date_1_string)}}}
    ]).toArray(function(err, data){
           // console.log(data); // it will print your collection data
			res.send(data);
        })
    });
  
});

app.get('/skydock_schudle_chart/:search_start_date/:search_end_date', function(req, res){

var search_start_date= req.params.search_start_date;
var search_end_date= req.params.search_end_date;
//console.log(search_start_date);
//console.log(search_end_date);
var search_start_date_1=new Date (parseInt(search_start_date));
var search_start_date_1_string=""+(search_start_date_1.getMonth()+1)+"/"+search_start_date_1.getDate()+"/"+search_start_date_1.getFullYear()+" "+search_start_date_1.getHours()+":"+search_start_date_1.getMinutes();

var search_end_date_1=new Date (parseInt(search_end_date));
var search_end_date_1_string=""+(search_end_date_1.getMonth()+1)+"/"+search_end_date_1.getDate()+"/"+search_end_date_1.getFullYear()+" "+search_end_date_1.getHours()+":"+search_end_date_1.getMinutes();
//console.log(search_start_date_1_string);
//console.log(search_end_date_1_string);

 /*  mongoose.connection.db.collection("skydata", function(err, collection){
	   collection.find({ "values.fromdatesearch": { $gte: new Date(search_start_date_1_string), $lte: new Date(search_end_date_1_string) } }).sort({"order":1}).toArray(function(err, data){
       // collection.find({ "values.fromdate": { $gte: search_start_date_1_string, $lte: search_end_date_1_string } }).sort({"order":1}).toArray(function(err, data){
		//collection.find({}).sort({"order":1}).toArray(function(err, data){
           // console.log(data); // it will print your collection data
			res.send(data);
        })
    }); */
	
	mongoose.connection.db.collection("skydata", function(err, collection){
	   collection.aggregate([
        //Pre-filter to have data arrays with at least one matching date
	{$match:{ 'values.fromdatesearch': {$gte: new Date(search_start_date_1_string), $lte: new Date(search_end_date_1_string)}}},
     {$addFields : {"values":{$filter:{ // We override the existing field!
		input: "$values",
		as: "item",
		cond: {$and: [
							{$gte: ["$$item.fromdatesearch", new Date(search_start_date_1_string)]},
							{$lte: ["$$item.fromdatesearch", new Date(search_end_date_1_string)]}
						]}
	}}}}
    ]).sort({"order":1}).toArray(function(err, data){
			res.send(data);
        })
    });
 
});
app.get('/update/:timestamp/:berth/:label/:customClass/:startDate/:endDate/:h_diff', function(req, res){
 var id= req.params.timestamp;
  var berth= req.params.berth;
  var prod= req.params.label;
  var priority= req.params.customClass;
    var startDate= req.params.startDate;
      var endDate= req.params.endDate;
	  var h_diff=req.params.h_diff;
 
		var dataObj=new Date();
		var timestamp=Date.parse(dataObj);
		
		
			var startDate_1=new Date (parseInt(req.params.startDate));
			
			var startDate_string=""+(startDate_1.getMonth()+1)+"/"+startDate_1.getDate()+"/"+startDate_1.getFullYear()+" "+startDate_1.getHours()+":"+startDate_1.getMinutes();
		    //alert(startDate_string)
		    /* var startDate_2=new Date (parseInt(req.params.endDate));
			var endDate_string=""+(startDate_2.getMonth()+1)+"/"+startDate_2.getDate()+"/"+startDate_2.getFullYear()+" "+startDate_2.getHours()+":"+startDate_2.getMinutes(); */
			//alert(endDate_string)
		    
			var date = new Date(startDate_string);
			  date.setHours(date.getHours() + h_diff);
			var endDate =date.toString();
			  console.log(date);
			var endDate_string=""+(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
			  console.log(endDate_string);
			  
			var datum2 = Date.parse(endDate_string);
				 //var endtime_tm=datum2/1000;
				 var endtime_tm=datum2;
				 //console.log(starttime_tm);
				 console.log(endtime_tm); 
			
			var days = (parseInt)(h_diff/24)
			//console.log(days);
			var hours = (parseInt)(h_diff%24)
			console.log(hours);
			
			var  integr = Math.floor(h_diff);
			var decimal = h_diff - integr; 
			var min=Math.round(decimal*60);
			console.log(integr);
		   console.log(decimal);
		   console.log(min);
			var span=days+","+hours +":"+min;
				//var span=12;
		

  
  	                                          mongoose.connection.db.collection('skydock').update(
												   {"timestamp" : parseInt(req.params.timestamp)},
												   { $set : { "fromdate": startDate_string,
															   "todate": endDate_string,
															   "span": span,
															    "timestamp":timestamp,
																"berth" : req.params.berth
													         }
												   }
												);  
												
											mongoose.connection.db.collection('skydata').update(
															   {},
															   { $pull: { values:{ "timestamp":parseInt(req.params.timestamp)}}},
															   { multi: true }
																); 

											 
 											mongoose.connection.db.collection("skydata", function(err, collection){
																					collection.find({'berth':req.params.berth }).toArray(function(err, finddata){
																						 // it will print your collection data
																						 console.log(finddata.length);
																						 if(finddata.length>0)
																						{
																							console.log("1");
																							console.log(finddata);
																							mongoose.connection.db.collection('skydata').update(
																							   {"berth" : req.params.berth },
																							   { $push : {  "values": 
																									{
																										//"from": req.body.starttime,
																										//"to": req.body.endtime,
																										"from": "/Date("+startDate+")/",
																										"to": "/Date("+endtime_tm+")/",
																										"label": prod,
																										"customClass":priority,
																										"dataObj":
																												{
																													"id":timestamp,
																													"berth": req.params.berth,
																													"h_diff":h_diff
																												},
																										 "timestamp":timestamp,
																										 "fromdate": startDate_string,
																										 "fromdatesearch":new Date(startDate_string),
															                                              "todate": endDate_string
																									}
																								}
																							   }
																							);
																						} 
																						 else
																						{
																							console.log("2");
																							 mongoose.connection.db.collection('skydata').insert({
												
																								"berth": req.params.berth,
																								"values": [
																									{
																										//"from": req.body.starttime,
																										//"to": req.body.endtime, 
																										"from": "/Date("+startDate+")/",
																										"to": "/Date("+endtime_tm+")/",
																										"label": prod,
																										"customClass":priority,
																										"dataObj":
																												{
																													"id":timestamp,
																													"berth": req.params.berth,
																													"h_diff":h_diff
																												},
																										"timestamp":timestamp,
																										"fromdate": startDate_string,
																										"fromdatesearch":new Date(startDate_string),
															                                             "todate": endDate_string
																									}
																								]
																							}); 
																						} 
																					})
																				  
									                                             }); 				
															
															
											
			var data='[{"stats":'+startDate_string+'},{"end":'+endDate_string+'},{"span":'+span+'},{"berth":'+req.params.berth+'}]';
		    res.send(data);							
   
 
});

app.get('/remove/:timestamp/', function(req, res){
	 var timestamp= req.params.timestamp;
	 console.log(timestamp);
 	 mongoose.connection.db.collection('skydata').update(
															   {},
															   { $pull: { values:{ "timestamp":parseInt(req.params.timestamp)}}},
															   { multi: true }
																); 
	  mongoose.connection.db.collection('skydock').remove( { "timestamp" :parseInt(req.params.timestamp) } )
	  var data='[{"stats":1}]';
     res.send(data);	
});

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});
