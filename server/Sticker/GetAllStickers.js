const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const app = express();
var con = Connection.myConnection;

function getAllSticker(res) {
	
	var query = "CALL StickerStatusSP()"
	//var param = [new Date(currentdate.getFullYear(),currentdate.getMonth(),currentdate.getDate(),currentdate.getHours(),currentdate.getMinutes(),currentdate.getSeconds()), req.body.NoOfSticker, req.body.UserID,req.body.IP,PrintDate,1]
	var queryObj = con.query({ 'sql': query }, function (err, result) {
		if (err) {
			//res.send('Error Insert PrintRequest'+err);
			console.log('Error' + err);
		}
		else {
			res.send(result[0]);
		}
	});
}

//getAllSticker();
module.exports.getAllStickerFun = getAllSticker;