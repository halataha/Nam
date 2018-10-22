const mysql = require('mysql');
const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const app = express();
var con = Connection.myConnection;

function UnlockPrintRequest(req, res) {
  	var query = "update Sticker set Locked=0 where Locked=1 and RequestID=?";
	var param = [req.body.RequestID];
	var queryObj = con.query({ 'sql': query }, param, function (err, result) {
		if (err) {
			console.log('Error Unlock PrintRequest' + err);
		}
		else {
			res.send({ status: true, message: 'all Updated' });
		}
	});
}

module.exports.UnlockPrintRequest = UnlockPrintRequest;