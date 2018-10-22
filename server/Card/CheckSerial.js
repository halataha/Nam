// import { resolve } from 'dns';

const Connection = require('../Connection/myconnection.js');
var con = Connection.myConnection;
var mydate = require('../PrintRequest/Date.js');
var datenow = mydate.datetime;
var expireDate = mydate.dateAfter;
var hh='';
//await generateSerial()
function generateSerial(Serial)
{
	 //Serial='56343667100207728';
	
   var query = "CALL CheckStickerSerial(?)"
   //var myserial=Serial;
   var myserial=Serial;
	
	
    var param = [myserial]
    
   
	return new Promise(function (resolve, reject) {
        con.query({ 'sql': query }, param, function (err, result) {
            if (err) {
                return reject(err);
            }
            else {
                // console.log(result);
             if(result[0].length>0) 
             {
                 //console.log('heree');
                 var newSerial=Math.floor((Math.random() * 9999) + 1111)+''+Math.floor((Math.random() * 9999) + 1111)+''+Math.floor((Math.random() * 9999) + 1111)+''+Math.floor((Math.random() * 9999) + 1111);
                 generateSerial(newSerial);
             }	  
               //console.log(result[0].length);
               hh=Serial;
            }
            console.log('hh: ', hh);
             resolve(hh);
        });   
    })
	//sleep(2000);
	//console.log(hh);
	//return sleep(2000);
	
}

//var hhh=generateSerial();
// console.log('hhh'+hh);

module.exports.checkFun=generateSerial;