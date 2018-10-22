const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const app = express();
var con = Connection.myConnection;

function getStore(req, res) {

	var query = "select*from Sticker where Status=3 and RequestID=" + req.body.RequestID

	var queryObj = con.query({ 'sql': query }, function (err, result) {
		if (err) {
			res.send('Error Select Sticker' + err);
		}
		else {
			var newArray = result.slice(0, req.body.Count);
			res.send(newArray);
		}
	});
}

function UpdatePrintRequestStatus(ID) {
	var lastQuery = 'update PrintRequest as p set p.Status = 4 where ((select count(*) from Sticker as s where s.RequestID = ' + ID + ' and s.Status = 4) = (select count(*) from Sticker as ss where ss.RequestID = ' + ID + ')) and p.ID = ' + ID
	var queObj = con.query({ 'sql': lastQuery });
}

function UpdateStore(req, res) {
  //console.log(req.body);
	var query = "update Sticker set StoreDate=now(),status = 4 where status = 3 and RequestID = " + req.body.RequestID + " and ID between " + req.body.From + " and " + req.body.To;
	var queryObj = con.query({ 'sql': query }, function (err, result) {
		if (err) {
			res.send('Error update Store' + err);
		}
		else {
			UpdatePrintRequestStatus(req.body.RequestID);
			addStoreInTransaction(req);
			res.send({ status: true, message: 'all Updated'});
		}
	});
}

function addStoreInTransaction(req)
{
	var query = "insert into Transaction(FromStrickerID,ToStickerID,TransactionDate,RequestID,Status)values(?,?,Now(),?,4)";
	var param=[req.body.From,req.body.To,req.body.RequestID];
	var queryObj = con.query({ 'sql': query },param,function (err, result) {
		if (err) {
			console.log('Error add transaction' + err);
		}
		else {
			console.log('add transaction success');			
		}
	});
}

module.exports.getStoreFun = getStore;
module.exports.updateStoreFun = UpdateStore;
