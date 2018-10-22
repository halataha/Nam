const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const app = express();
var con = Connection.myConnection;
function GetProductType(req, res) {

	var query = "select * from RequestType";
	var queryObj = con.query({ 'sql': query }, function (err, result) {

		if (err) {
			console.log('Err get RequestType' + err);
			res.status(500).send('Database Query Error !!');
		}

		else {
			res.send(result);
		}

	});
}

function CreateProductType(req, res) {

    var query = "insert into RequestType(Name) values(?)";
    var p=[req.body.Name];
	var queryObj = con.query({ 'sql': query },p, function (err, result) {

		if (err) {
			console.log('Err get RequestType' + err);
		}

		else {
			res.send(result);
		}

	});
}

function EditProductType(req, res)
{
	var query = "update RequestType set Name=? where ID=?";
    var p=[req.body.Name,req.body.ID];
	var queryObj = con.query({ 'sql': query },p, function (err, result) {

		if (err) {
			console.log('Err Edit RequestType' + err);
		}

		else {
			res.send({ status: true });
		}

	});
}

function deleteproductType(req, res) {

	var que = "delete from  RequestType  where ID=?"


	var p = [req.body.ID]


	var queObj = con.query({ 'sql': que }, p, function (err, result) {

		if (err) {
			if (err.errno === 1451) {
				res.status(500).send('Product Has Related Data !!');
			}
			console.log(err);
			res.status(500).send('Database Query Error !!');
		}
		else {
			res.send({ status: true });
		}
	});
}






module.exports.GetProductType= GetProductType;
module.exports.CreateProductType = CreateProductType;
module.exports.deleteproductType = deleteproductType;
module.exports.EditProductType = EditProductType;

