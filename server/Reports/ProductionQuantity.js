const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const app = express();
var con = Connection.myConnection;


function ProductionQuantityReport(req, res) {

	var query = `select RequestID, count(*) as DispenceCount,month(DispenseDate) as Month 
    from openmind_Namaa.Sticker as Dispence
    where Status = 5 and DispenseDate between ? and ?
    group  by MONTHNAME(DispenseDate),RequestID;select S.RequestID, sum(ToStickerID - FromStrickerID +1) as ReturnCount ,month(TransactionDate) as Month from openmind_Namaa.Transaction T
    inner join openmind_Namaa.Sticker S on T.FromStrickerID = S.ID where T.Status = 7 and TransactionDate between ? and ?
    group by MONTHNAME(TransactionDate),S.RequestID`;


	var p = [req.body.From, req.body.To, req.body.From, req.body.To];
	var queryObj = con.query({ 'sql': query }, p, function (err, result) {
		if (err) {
			res.send('error get data' + err);
		}
		else {
			var arr = [];
			for (let index = 0; index < result.length; index++) {
				result[index].forEach(element => {
					if (element.DispenceCount) {
						arr.push({
							RequestID: element.RequestID,
							DispencedCount: element.DispenceCount,
							ReturnedCount: 0,
							Month: element.Month
						});
					} else if (element.ReturnCount) {
						arr.push({
							RequestID: element.RequestID,
							DispencedCount: 0,
							ReturnedCount: element.ReturnCount,
							Month: element.Month
						});
					}
				});
			}

			res.send(arr);
		}
	});
}

module.exports.ProductionQuantityReport = ProductionQuantityReport;