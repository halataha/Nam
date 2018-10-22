const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const app = express();
var con = Connection.myConnection;
var request = require("request");

function CheckSticker(req, res) {
   	var query = "CALL CheckStickerMobilSp(?,?)"
	var Response='0';
	var R='Not Exsist';
	var Response=0;
	var param = [req.body.Serial,req.body.Date]
	var queryObj = con.query({ 'sql': query }, param, function (err, result) {
		if (err) {
			console.log('Error Check Serial');
		}
		else {			
			
					
			
			if(result[0][0].ExsistSerial!=null)
			{
				Response='1';//Expired and Not valid
			    R='Expired';
			}
			
			if(result[1][0].NotExpired!=null)
			{
				Response='2';//not Expired not valid
			    R='Not Valid';
			}
			
			if(result[2][0].Valid!=null)
			{
				Response='3';//Valid
				R='Valid';
			}
			if(result[3][0].Used!=null)
			{
				Response='4';//Used
			    R='Used';
			}
			
			if(Response==3)
			{
              var messageToUser='العبوة صالحة';
			  var propertiesObject = {  userName: "Host4egyptAPI", Password: "iqt14PI5ET"
			  ,SMSText:R,SMSLang:'e',SMSSender:'namaa',SMSReceiver:req.body.Mobile};
			  var url="https://smsvas.vlserv.com/KannelSending/service.asmx/SendSMS";
			  request({url:url, qs:propertiesObject}, function(err, response, body) {
			  if(err) { console.log(err); return; }
			  console.log("Result : " + body);
			 });

		  }


			res.send(R);
					
		  var currentdate = new Date();	
		  var param22 = [Response, req.body.Serial,req.body.Mobile]	
		  var q="insert into Message (TransactionDate,Response,StickerSerial,MobileNo) values(Now(),?,?,?);update Sticker set UseDate=Now(),Status=6  where Serial="+req.body.Serial;
		  var queryObj22 = con.query({ 'sql': q },param22, function (err, result) {
		 if (err) {
		  console.log('Error Insert Message'+err);
		  }
		  
	      });
			
		
		}
	});
		
	
}

module.exports.CheckStickerFun = CheckSticker;