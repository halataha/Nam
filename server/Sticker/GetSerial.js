const Connection = require('../Connection/myconnection.js'); //using module for connection
var con = Connection.myConnection;

function getSerial(res) {

	var query = "select Serial from Sticker"

	var queryObj = con.query({ 'sql': query }, function (err, result) {
		if (err) {
			res.send('Error Select Sticker' + err); 
		}
		else {
			res.send(result);
			

		}


	});



}
module.exports.getSerialFun = getSerial;