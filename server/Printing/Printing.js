const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const app = express();
var con = Connection.myConnection;

function GetPrintingRequests(res) {

	var query = 'CALL GetReadyForPrintRequest()';
	var queryObj = con.query({ 'sql': query }, function (err, result) {
		if (err) {
			res.status(500).send('Database Query Error !!');
		}
		else {
			for (var i = 0; i < result[0].length; i++) {
				if(result[0][i].Status == 2){
					result[0][i].Status = "Ready For Print";
				}

				result[0][i].DispencePercentage = Math.round((result[0][i].Dispence / result[0][i].NoOfSticker) * 100);
				result[0][i].PrintedPercentage = Math.round((result[0][i].Printed / result[0][i].NoOfSticker) * 100);
				result[0][i].StoredPercentage = Math.round((result[0][i].Stored / result[0][i].NoOfSticker) * 100);
				result[0][i].ReadyForPrintPercentage = Math.round((result[0][i].ReadyForPrint / result[0][i].NoOfSticker) * 100);
				result[0][i].LockedPercentage = Math.round((result[0][i].Locked / result[0][i].NoOfSticker) * 100);
			}
			res.send(result[0]);
		}
	});
}

app.use(express.json());

module.exports.GetPrintingReqFunc = GetPrintingRequests;