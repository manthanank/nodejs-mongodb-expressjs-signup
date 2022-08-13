const express = require('express');
const path = require('path'); 
const fs = require('fs'); 
const app = express();
const mongo = require('mongodb');
const new_db = "mongodb://localhost:27017/data";
const bodyParser = require('body-parser');
const crypto = require('crypto');

require('dotenv').config();

//Creating the database

app.get('/',function(req,res){
	res.set({
		'Access-Control-Allow-Origin' : '*'
	});
	return res.redirect('/public/index.html');
}).listen(3000);

console.log("Server listening at : 3000");
app.use('/public', express.static(__dirname + '/public'));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));

const getHash = ( pass , phone ) => {
				
				const hmac = crypto.createHmac('sha512', phone);
				
				//passing the data to be hashed
				data = hmac.update(pass);
				//Creating the hmac in the required format
				gen_hmac= data.digest('hex');
				//Printing the output on the console
				console.log("hmac : " + gen_hmac);
				return gen_hmac;
}

// Sign-up function starts here. . .
app.post('/sign_up' ,function(req,res){
	const name = req.body.name;
	const email= req.body.email;
	const pass = req.body.password;
		const phone = req.body.phone;
	const password = getHash( pass , phone ); 				

	
	const data = {
		"name":name,
		"email":email,
		"password": password, 
		"phone" : phone
	}
	
	mongo.connect(new_db , function(error , db){
		if (error){
			throw error;
		}
		console.log("connected to database successfully");
		//CREATING A COLLECTION IN MONGODB USING NODE.JS
		db.collection("details").insertOne(data, (err , collection) => {
			if(err) throw err;
			console.log("Record inserted successfully");
			console.log(collection);
		});
	});
	
	console.log("DATA is " + JSON.stringify(data) );
	res.set({
		'Access-Control-Allow-Origin' : '*'
	});
	return res.redirect('/public/success.html'); 
	
	/** 
	const filePath = path.join(__dirname, 'public/success.html');
    const stat = fs.statSync(filePath);
    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': stat.size
    });
    const readStream = fs.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);	
	*/ 

});