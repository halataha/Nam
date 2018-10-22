const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const app = express();
var con = Connection.myConnection;

function getPrint(req, res) {

	var query = "select * from Sticker where Status=2 and Locked=0 and  RequestID=" + req.body.RequestID + " limit " + req.body.Count

	var updateLock = "update Sticker set Locked=1 where Status=2 and Locked=0 and  RequestID=" + req.body.RequestID + " limit " + req.body.Count

	var queryObj = con.query({ 'sql': query }, function (err, result) {
		if (err) {
			res.send('Error Select Sticker' + err);
		}
		else {
			ChangeLock(updateLock);
			res.send(result);
		}
	});
}

function ChangeLock(updateLockQuery) {
	var queryObj = con.query({ 'sql': updateLockQuery });
}

function UpdatePrintRequestStatus(ID) {
	var lastQuery = 'update PrintRequest as p set p.Status = 3 where ((select count(*) from Sticker as s where s.RequestID = ' + ID + ' and s.Status = 3) = (select count(*) from Sticker as s where s.RequestID = ' + ID + ')) and p.ID = ' + ID
	var queObj = con.query({ 'sql': lastQuery });
}

function UpdateStickerStatus(req, res) {

	// var currentdate = new Date();

	// var PrintDate = new Date(currentdate.getFullYear(), currentdate.getMonth(), currentdate.getDate(), currentdate.getHours(), currentdate.getMinutes(), currentdate.getSeconds());
    	
	var query = "update Sticker set PrintDate=now(),Status=3 where status =2 and RequestID =" + req.body.RequestID + " and ID between " + req.body.From + " and " + req.body.To;

	// var query = "update openmind_Namaa.Sticker set PrintDate=now(),Status=3 where status =2 and RequestID =" + req.body.RequestID + " and ID >= " + req.body.From + " limit " + req.body.Count;	
		
	var updateLock2 = "update Sticker set Locked=0  where Status=2 and Locked=1 and  RequestID=" + req.body.RequestID + " and ID between " + req.body.From + " and " + req.body.To;

	// var updateLock2 = "update Sticker set Locked=0  where Status=2 and Locked=1 and  RequestID=" + req.body.RequestID + " and ID >= " + req.body.From + " limit " + req.body.Count;

	ChangeLock(updateLock2);

	var queryObj = con.query({ 'sql': query },function (err, result) {
		if (err) {
			res.send('Error Update Sticker' + err);
		}
		else {
			UpdatePrintRequestStatus(req.body.RequestID);
			res.send({ status: true, message: 'all Updated' });
		}
	});
}

module.exports.getPrintFun = getPrint;
module.exports.getUpdateFun = UpdateStickerStatus;