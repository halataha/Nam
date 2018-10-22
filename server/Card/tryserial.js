const express=require('express'); //use module express for routing
const Connection=require('../Connection/myconnection.js'); //using module for connection
const app=express();
var exist=0;
var myResult=[]; 

var con = Connection.myConnection;

function IsExist()
{
	
	var query = "SELECT * FROM Sticker"
	return con.query({ 'sql' : query}, function(err,result) {
	if(err) {
		//res.send('Error Insert Card'+err);
		console.log('Error ');
	}
	else {
	   for(var i=0;i<result.length;i++)
	   {
		//console.log(result[i]);  
         if(result[i].Serial=='52771324')
		 {
			exist=1;
			//console.log('hfffgfg');
		 }			 
	   }
    
   }
//insert card
});
 //console.log(exsist);
 // return exsist;
}


var xx=IsExist().then((btngan)=>{
	console.log(exist)
});
console.log(xx);
 
 
 

//function IsExsist()
//{
	
//con.connect(function(err) {
  //if (err) throw err;
  //con.query("SELECT * FROM Sticker", function (err, result, fields) {
    //if (err) throw err;
    	
	//for(var i=0;i<result.length;i++)
	//{
	  //if(result[i].Serial=='52771324')
	  //{
		 // isExsist=1;
	  //}
	  
	//}
	
	//console.log(isExsist);
	
  //});
//});
//return exsist;
//}

//IsExsist();


//home request


//module.exports.exsistFun=IsExsist;


app.listen(3000,()=>{console.log('Listen on 3000!')})
