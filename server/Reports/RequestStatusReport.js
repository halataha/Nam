const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const app = express();
var con = Connection.myConnection;


function RequetStatusReport(req, res) {

	var query = "CALL RequestStatusReportSp(?,?)";

	var p = [req.body.From, req.body.To];


	var queryObj = con.query({ 'sql': query }, p, function (err, result) {
		if (err) {
			res.send('error get data' + err);
		}
		else {
			for (var i = 0; i < result[0].length; i++) {
				result[0][i].DispencedPercentage = Math.round((result[0][i].Dispence / result[0][i].NoOfSticker) * 100);
				result[0][i].PrintedPercentage = Math.round((result[0][i].Printed / result[0][i].NoOfSticker) * 100);
				result[0][i].StoredPercentage = Math.round((result[0][i].Stored / result[0][i].NoOfSticker) * 100);
				result[0][i].ReturnedPercentage = Math.round((result[0][i].Return / result[0][i].NoOfSticker) * 100)
			}
			res.send(result[0]);
		}
	});
}

module.exports.RequetStatusReport = RequetStatusReport;