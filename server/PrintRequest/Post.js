const mysql = require('mysql');
const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const Card = require('../Card/Post.js');//using Post Card Function
const app = express();
var con = Connection.myConnection;

function PostPrintRequest(req, res) {

	var NumberOfCard = parseInt(req.body.NoOfSticker.toString());

	var currentdate = new Date();

	var PrintDate = new Date(currentdate.getFullYear(), currentdate.getMonth() + 1, currentdate.getDate(), currentdate.getHours(), currentdate.getMinutes(), currentdate.getSeconds());

	var query = "CALL InsertPrintRequestSP(?,?,?,?,?,?,?)"
	var param = [new Date(currentdate.getFullYear(), currentdate.getMonth(), currentdate.getDate(), currentdate.getHours(), currentdate.getMinutes(), currentdate.getSeconds()), req.body.NoOfSticker, req.body.UserID, req.body.IP, PrintDate, 1,req.body.PrintType]
	var queryObj = con.query({ 'sql': query }, param, function (err, result) {
		if (err) {
			res.send('Error Insert PrintRequest' + err);
		}
		else {
			var myid = result[0];
			Card.PostCard(NumberOfCard, myid[0].id.toString(), currentdate, res);
		}
	});
}

module.exports.PostPrint = PostPrintRequest;