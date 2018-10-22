var currentdate = new Date(); 

var datetimeNow=new Date(currentdate.getFullYear(),currentdate.getMonth(),currentdate.getDate(),currentdate.getHours(),currentdate.getMinutes(),currentdate.getSeconds());

var dateAfter=new Date(currentdate.getFullYear(),currentdate.getMonth()+1,currentdate.getDate(),currentdate.getHours(),currentdate.getMinutes(),currentdate.getSeconds());

module.exports.datetime=datetimeNow;
module.exports.dateAfter=dateAfter;