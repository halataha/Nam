const express=require('express'); //use module express for routing
const Connection=require('../Connection/myconnection.js'); //using module for connection
const app=express();
var isExsist=0;
var myResult=[]; //list for send  to user
var con = Connection.myConnection;

var exsistSerial=function exsist()
{	
//con.connect(function(err) {
  //if (err) throw err;
  //con.query("SELECT * FROM Sticker", function (err, result, fields) {
    //if (err) throw err;
		
	//for(var i=0;i<result.length;i++)
	//{
	  //if(result[i].Serial=='52771324')
	  //{
		//  isExsist=1;
	  //}
	  
	//}
	
	//console.log('inside function: ', isExsist);
	
  //});
  
  
  
  
//});	



//return isExsist;
	

var query = "SELECT * FROM Sticker"
  

  
	//var param=[1,RequestID,datenow,expireDate,Math.floor((Math.random() * 99999999) + 11111111)] 
	
	var queryObj = con.query({ 'sql' : query}, function(err,result) {
   if(err) {
    //res.send('Error Insert Card'+err);
    console.log('Error ');
	}
   else {
        console.log('yesss select');	
      for(var i=0;i<result.length;i++)
	{
	if(true)//result[i].Serial=='52771324')
	{
	console.log('yesss');
	 isExsist=1;
	 
	}
	  
	}
   }
//insert card
});
	
   	
	return isExsist;
}

console.log(isExsist);
//module.exports.SerialExsistfun=ExsistSerial;
//module.exports.SerialExsistValue=isExsist;

//home request

app.get('/PrintRequest',(req,res)=>{
	debugger;
	console.log(isExsist);
	
		
});

//app.use(express.json());

//app.get('/api/Employees',(req,res)=>{	
    	
		
		
	//res.end(JSON.stringify(myResult));
	
  //});




app.listen(3000,()=>{console.log('Listen on 3000!')})

