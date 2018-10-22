const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const app = express();
var con = Connection.myConnection;


function usedNumber(req, res) {

	var que = `SELECT S.ID,
S.Serial,S.UseDate,M.MobileNo,P.ID as RequestID
 from Sticker as S
 INNER JOIN Message as M ON S.Serial = M.StickerSerial and M.Response=3
 INNER JOIN PrintRequest as P ON P.ID = S.RequestID
 where S.UseDate between ? and ? and S.Status=6 
 `


	var p = [req.body.From, req.body.To]


	var queObj = con.query({ 'sql': que }, p, function (err, result) {

		if (err) {
			console.log('Error Report UsedNumber');
		}
		else {
			res.send(result);
		}
	});
}


function ExpiredNumber(req, res) {

	var q = `select S.ID,S.Serial,S.ExpireDate,P.RequestDate from  Sticker as S

	inner join PrintRequest as P

	on  P.ID=S.RequestID

	where S.ExpireDate between ? and ? and S.Status = 5 `

	var p = [req.body.From,req.body.To];

	var queObj = con.query({ 'sql': q },p, function (err, result) {

		if (err) {
			console.log('Error Report ExpiredNumber');
		}
		else {
			res.send(result);
		}
	});
}



function RepetedNumber(req, res) {

	var que = `select m.StickerSerial,m.TransactionDate,m.MobileNo,s.RequestID from Message as m inner join Sticker as s
            on m.StickerSerial=s.Serial 
            where m.Response=4 and m.TransactionDate between ? and ?`

	var pa = [req.body.From,req.body.To];

	var queObj = con.query({ 'sql': que },pa, function (err, result) {

		if (err) {
          console.log('Error Report RepetedNumber');
		}
		else {
			res.send(result);
		}
	});
}


function notExsistNumber(req, res) {

	var que = `select StickerSerial,TransactionDate,MobileNo from Message
              where Response=0 and TransactionDate between ? and ?
              `

	var pa = [req.body.From,req.body.To];

	var queObj = con.query({ 'sql': que },pa, function (err, result) {

		if (err) {
          console.log('Error Report Not Exsist');
		}
		else {
			res.send(result);
		}
	});
}

 


module.exports.usedNumber=usedNumber;
module.exports.ExpiredNumber=ExpiredNumber;
module.exports.RepetedNumber=RepetedNumber;
module.exports.notExsistNumber=notExsistNumber;
