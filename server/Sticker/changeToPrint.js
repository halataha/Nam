const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const app = express();
var con = Connection.myConnection;

function getSticker(req,res) {
	console.log(req.body);

	var query = "select*from Sticker where Status=2 and RequestID="+req.body.RequestID

	var queryObj = con.query({ 'sql': query }, function (err, result) {
		if (err) {
			res.send('Error Select Sticker'+ err);
		}
		else {	
			var newArray = result.slice(0, 10);		
			res.send(newArray);
		}


	});



}

module.exports.getStickerFun=getSticker;