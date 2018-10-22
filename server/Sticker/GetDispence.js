const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const app = express();
var con = Connection.myConnection;
//var expiredate=3;

function updateDispence(req, res, expiredate) {

    //getExpired(res);
    var query = "update Sticker set  ExpireDate=DATE_ADD(now(), INTERVAL " + expiredate + " MONTH), DispenseDate=Now(),Status = 5  where Status = 4 and  RequestID = " + req.body.RequestID + " and ID between " + req.body.From + " and " + req.body.To;

    var queryObj = con.query({ 'sql': query }, function (err, result) {
        if (err) {
            res.send('Error Update Sticker' + err);
        }
        else {
            UpdatePrintRequestStatus(req.body.RequestID);
            res.send({ status: true, message: 'All Updated' });
            //res.send(expiredate.toString());
        }
    });
}

function UpdatePrintRequestStatus(ID) {
    var lastQuery = 'update PrintRequest as p set p.Status = 5 where ((select count(*) from Sticker as s where s.RequestID = ' + ID + ' and s.Status = 5) = (select count(*) from Sticker as s where s.RequestID = ' + ID + ')) and p.ID = ' + ID
    var queObj = con.query({ 'sql': lastQuery });
}

function addDispenceInTransaction(req)
{
	var query = "insert into Transaction(FromStrickerID,ToStickerID,TransactionDate,RequestID,Status)values(?,?,Now(),?,5)";
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


function updateDispenceStickers(req, res) {
    var query = "select * from Setting";
    //console.log(query);
    var queryObj = con.query({ 'sql': query }, function (err, result) {
        if (err) {
            console.log('Error get expire date' + err);
        }
        else {
            //expiredate=result[0].ValidMonths;   
            //res.send(result[0].ValidMonths.toString());
            updateDispence(req, res, result[0].ValidMonths);
            addDispenceInTransaction(req);

        }
    });
}


module.exports.dispencefunc = updateDispenceStickers;