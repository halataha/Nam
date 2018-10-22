const Connection = require('../Connection/myconnection.js');
const CheckSerial = require('./CheckSerial.js')
var con = Connection.myConnection;
var mydate = require('../PrintRequest/Date.js');
var datenow = mydate.datetime;
var expireDate = mydate.dateAfter;

var PostCard = function InsertCard(NoOfSticker, RequestID, currentDate, res) {

	var query = "CALL InsertStickersSP(?,?)"


	var param = [RequestID, NoOfSticker]


	var queryObj = con.query({ 'sql': query }, param, function (err, result) {

		if (err) {
			console.log('Err insert Sticker' + err);
		}

		else {
			res.send({ RequestID: RequestID, RequestDate: currentDate });
		}

	});

	//update request status

	var updatequery = "update PrintRequest set Status=2 where ID=" + RequestID;
	var queryObj = con.query({ 'sql': updatequery }, function (err, result) {
		if (err) {
			console.log('Error update sticker' + err);
		}
		else {
			console.log('update success');
		}
	});
}

module.exports.PostCard = PostCard;