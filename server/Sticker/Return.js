const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const app = express();
var con = Connection.myConnection;

function Return(req, res) {

	var query1 = "select * from Sticker where ID between " + req.body.From + " and " + req.body.To + "";

	var queryObj = con.query({ 'sql': query1 }, function (err, result) {
		if (err) {
			res.status(400).send({ status: false, message: 'Database Query Error !! Invalid Range' })
		} else {
			var data = result;
			var InvalidSticker = data.filter(function (sticker) {
				return sticker.Status !== 5;
			});

			if (InvalidSticker.length === 0) {
				UpdateAndInsertTransaction(req, res);
			} else {
				res.status(400).send({ status: false, message: 'Invalid Stickers Status In This Range' });
			}
		}
	});
}

function UpdateAndInsertTransaction(req, res) {

	var query2 = "update Sticker set Status=4 where ID between " + req.body.From + " and " + req.body.To + ";insert into Transaction(FromStrickerID,ToStickerID,TransactionDate,Status)values(" + req.body.From + "," + req.body.To + ",Now(),7)";

	var queryObj = con.query({ 'sql': query2 }, function (err, result) {
		if (err) {
			res.status(500).send({ status: false, message: "Database Query Error" });
		}
		else {
			res.status(200).send({ status: true, message: "Stickers Returned Successfully !!" });
		}
	});
}

module.exports.Return = Return;
