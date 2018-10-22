const Connection = require('../Connection/myconnection.js');
var con = Connection.myConnection;

function getSummary(req, res) {

	if (req.body.RequestID) {
		var query = "CALL GetSummarySP(?)"
		var param = [req.body.RequestID];
		var queryObj = con.query({ 'sql': query }, param, function (err, result) {
			if (err) {
				res.status(500).send('Database Query Error !!');
			}
			else {
				res.send(result[0]);
			}
		});
	} else {
		res.status(500).send("Invalid Arguments !!");
	}
}

function getStoreSummary(req, res) {
	if (req.body.RequestID) {
		var query = "CALL StoreSummarySP(?)"
		var param = [req.body.RequestID];
		var queryObj = con.query({ 'sql': query }, param, function (err, result) {
			if (err) {
				res.send('Error Summary' + err);
			}
			else {
				res.send(result[0]);
			}
		});
	}else{
		res.status(500).send("Invalid Arguments !!");
	}
}

function getDispenceSummary(req, res) {
	if (req.body.RequestID) {
		var query = "CALL DispenceSummarySP(?)"
		var param = [req.body.RequestID];
		var queryObj = con.query({ 'sql': query }, param, function (err, result) {
			if (err) {
				res.status(500).send('Database Query Error !!');
			}
			else {
				res.send(result[0]);
			}
		});
	}else{
		res.status(500).send("Invalid Arguments !!");
	}
}

module.exports.getSummaryFun = getSummary;
module.exports.getStoreSummary = getStoreSummary;
module.exports.getDispenceSummary = getDispenceSummary;