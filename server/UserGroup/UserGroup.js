const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const app = express();
var con = Connection.myConnection;


function addUserGroup(req, res) {

	var query = "insert into UserGroup(Name)values(?)"


	var param = [req.body.GroupName]


	var queryObj = con.query({ 'sql': query }, param, function (err, result) {

		if (err) {
			if (err.errno === 1062 && err.code === 'ER_DUP_ENTRY') {
				res.status(400).send({ status: false, errno: 1062, errorType: 'GroupDuplicate', message: `Group Already Exist !!`, error: err });
			} else {
				console.log("eeeeeeee " + err);
				res.status(500).send({ status: false, message: `Error Add Group ${err}` });
			}
		} else {
			res.send({ status: true, GroupID: result.insertId });
		}

	});
}

function editUserGroup(req, res) {

	var query = "update UserGroup set Name=? where ID=?"


	var param = [req.body.NewGroupName, req.body.GroupID]


	var queryObj = con.query({ 'sql': query }, param, function (err, result) {

		if (err) {
			console.log('Err Edit Groups' + err);
		}

		else {
			res.send({ status: true, message: 'Edit Group Success' });
		}

	});
}

function deleteUserGroup(req, res) {

	var query = "delete from UserGroup where ID=?"


	var param = [req.body.GroupID]


	var queryObj = con.query({ 'sql': query }, param, function (err, result) {

		if (err) {
			console.log('Err Delete Groups' + err);
		}

		else {
			res.send({ status: true });
		}

	});
}



module.exports.addUserGroup = addUserGroup;
module.exports.editUserGroup = editUserGroup;
module.exports.deleteUserGroup = deleteUserGroup;
