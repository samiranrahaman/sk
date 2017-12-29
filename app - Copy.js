var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


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
				  // example schema
				/* var schema = new Schema({
					img: { data: Buffer, contentType: String }
				}); */
				 var schema = new Schema({
					 _id:Number,
					 name: String,
					 point:Number,
					 folder:String,
					 stat:String
					 
				}); 

				// our model
				 var A = mongoose.model('A', schema);
				      /*  mongoose.connection.db.collection('counters').insert(    {
							  _id: "userid",
							  seq: 0    } ) */ //used first time
					  /* function getNextSequence() {
						 console.log('hiiii');
						     var ret = mongoose.connection.collection('counters').findAndModify(
								  {
									query: { _id: "userid" },
									update: { $inc: { seq: 1 } },
									new: true
								  }
						   );   
						  
						
                           
						   return ret.seq; 
						} */
						 
			});



app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});
app.get('/list', function(req, res){

 res.sendFile(path.join(__dirname, 'views/list.html'));
 
  
});
app.get('/skydock', function(req, res){

 res.sendFile(path.join(__dirname, 'views/skydock/index.html'));
 
  
});
app.get('/listview', function(req, res){


  mongoose.connection.db.collection("A", function(err, collection){
        collection.find({}).toArray(function(err, data){
           // console.log(data); // it will print your collection data
			res.send(data);
        })
    });

  
});

app.get('/skydock_schudle', function(req, res){


  mongoose.connection.db.collection("skydock", function(err, collection){
        collection.find({}).toArray(function(err, data){
           // console.log(data); // it will print your collection data
			res.send(data);
        })
    });

  
});

app.get('/remove/:_id/', function(req, res){
	var fs = require('fs');
    mongoose.connection.db.collection("A", function(err, collection){
        collection.find({_id:parseInt(req.params._id)}).toArray(function(err, data){
          // console.log(data[0].name); // it will print your collection data
			//res.send(data);
						 mongoose.connection.db.collection('A').update({ _id: parseInt(req.params._id) }, {$set:{"point":0,"folder":'archive',"stat":0}}, function(err, affected, resp) {
								  // var src='C:/Users/samiran/nodejs/file-uploader-master/public/folder1/'+data[0].name;
									//var dest='C:/Users/samiran/nodejs/file-uploader-master/public/archive/'+data[0].name;
									var src=path.join(__dirname, 'public')+'/folder1/'+data[0].name;
									var dest=path.join(__dirname, 'public')+'/archive/'+data[0].name;
                                     
									
									if (!fs.existsSync(src)) {
										 console.log("ssss");
									  }
									  else
									  {
									 // var data = fs.readFileSync(src, 'utf-8');
									 var data1 = fs.readFileSync(src);
									  fs.writeFileSync(dest, data1);
									  fs.unlink(src, (err) => {
											  if (err) throw err;
											  console.log('successfully deleted');
											});
									  console.log("done");
									  }  
									  
									  
									  mongoose.connection.db.collection("A", function(err, collection){
										collection.find({"_id": { $lt: parseInt(req.params._id) },'folder':'folder1' }).toArray(function(err, data4){
										    //console.log(data4); // it will print your collection data
											//res.send(data);
											for (var i = 0, len = data4.length; i < len; i++) {
												  mongoose.connection.db.collection('A').update({"_id":parseInt(data4[i]._id)}, {$inc:{ point: 1 }}, function(err, affected, resp) {
													   //console.log(resp);
													  //console.log(err);
														   })
												}
										})
									  
									  });
									  
									  
									  
									  
									  
   
                  
					})
			
			
        })
    });
	
    	   
	   
	    mongoose.connection.db.collection("A", function(err, collection){
        collection.find({}).toArray(function(err, data){
            console.log(data); // it will print your collection data
			res.send(data);
        })
    }); 
	
	 
  
});

/* app.get('/uploadfile', function(req, res){
  res.sendFile(path.join(__dirname, 'views/uploadfile.html'));
}); */

app.post('/upload', function(req, res){

  // create an incoming form object
  console.log('wait22.......................'); 
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  //form.multiples = true;
  form.multiples = false;

  // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/public/folder1');
	//form.uploadDir = 'http://btranz.website/appma/';

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
 // var imagepath=req.files.file.path;
  form.on('file', function(field, file){
	//imagepath='./public/uploads/' + req.files.uploads[0].name;
	
	//imagepath='/public/uploads/' + req.file;
	var ran=Math.random();
	console.log(path.join(form.uploadDir, ran+file.name));
	console.log(file.path);
	
	fs.rename(file.path, path.join(form.uploadDir, ran+file.name));
	
	
	
	
		  mongoose.connection.db.collection('counters').update({"_id":"userid"}, {$inc:{ seq: 1 }}, function(err, affected, resp) {
			   console.log(resp);
			  console.log(err);
				   })	
			//var id='';	   
			mongoose.connection.db.collection("counters", function(err, collection){
				collection.find({}).toArray(function(err, data){
				   /* console.log(data[0].seq); // it will print your collection data
				  // return data[0].seq;
					id=data[0].seq; */
					mongoose.connection.db.collection('A').insert({
						   //"_id":getNextSequenceValue("productid"),
						   _id:data[0].seq,
						   name: ran+file.name,
						   point:1,
						   folder:'folder1',
						   stat:1
						});
				})
			});	
	
	
	
	
	
	//console.log(id);
	
	/* mongoose.connection.db.collection('A').insert({
		   //"_id":getNextSequenceValue("productid"),
		   _id:id,
		   name: file.name,
		   point:1,
		   folder:'folder1',
		   stat:1
		}); */
	
  });
  

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);
 
  
});

/*
var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
*/
/*
app.listen(app.get('port'), function(){
console.log( 'Express started on http://localhost:' +
app.get('port') + '; press Ctrl-C to terminate.' );
});*/
/*app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});*/
//https://github.com/samiranrahaman/filemanage.git

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});
