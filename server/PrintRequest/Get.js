const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const app = express();
var con = Connection.myConnection;

function getPrint(res) {

	var query = 'CALL GetPrintRequests()';
	var queryObj = con.query({ 'sql': query }, function (err, result) {
		if (err) {
			res.send('Error Insert PrintRequest' + err);
		}
		else {
			for (var i = 0; i < result[0].length; i++) {
				if (result[0][i].Status === 1) {
					result[0][i].Status = "Requested";
				} else if (result[0][i].Status === 2) {
					result[0][i].Status = "Ready For Print";
				} else if (result[0][i].Status === 3) {
					result[0][i].Status = "Printed";
				} else if (result[0][i].Status === 4) {
					result[0][i].Status = "Stored";
				} else if (result[0][i].Status === 5) {
					result[0][i].Status = "Dispenced";
				}

				result[0][i].RequestDate = new Date(result[0][i].RequestDate).toLocaleString();
				result[0][i].PrintDate = new Date(result[0][i].PrintDate).toLocaleString();

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
module.exports.getprintfun = getPrint;
