const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const bcrypt = require('bcrypt-nodejs');
const app = express();
var con = Connection.myConnection;

function getUsers(req, res) {

	var query = "Select u.ID, u.FullName, u.Email, u.GroupID, g.Name as GroupName from User as u inner join UserGroup as g on g.ID = u.GroupID";
	var queryObj = con.query({ 'sql': query }, function (err, result) {

		if (err) {
			console.log('Err get Users' + err);
			res.status(500).send('Database Query Error !!');
		}

		else {
			res.send({ status: true, data: result });
		}

	});
}

function deleteUsers(req, res) {

	var que = "delete from  User  where ID=?"


	var p = [req.body.ID]


	var queObj = con.query({ 'sql': que }, p, function (err, result) {

		if (err) {
			if (err.errno === 1451) {
				res.status(500).send('User Has Related Data !!');
			}
			console.log(err);
			res.status(500).send('Database Query Error !!');
		}
		else {
			res.send({ status: true });
		}
	});
}

function hashPassword(userPassword, cb) {
	bcrypt.genSalt(11, (err, salt) => {
		if (err)
			return cb(err);
		bcrypt.hash(userPassword, salt, null, (error, hashedPassword) => {
			if (error)
				return cb(error);
			return cb(null, hashedPassword);
		});
	});
}

function EditUser(req, res) {

	if (req.body.Password === null) {
		var que = "update User set FullName=?,Email=?,GroupID=?  where ID=?"

		var p = [req.body.FullName, req.body.Email, req.body.GroupID, req.body.ID]

		var queObj = con.query({ 'sql': que }, p, function (err, result) {

			if (err) {
				if (err.errno === 1062 && err.code === 'ER_DUP_ENTRY') {
					if (err.message.indexOf('FullName_UNIQUE_1062') !== -1) {
						res.status(400).send({ status: false, errno: 1062, errorType: 'UserNameDuplicate', message: `UserName Already Exist !!`, error: err });
					} else if (err.message.indexOf('Email_UNIQUE_1062') !== -1) {
						res.status(400).send({ status: false, errno: 1062, errorType: 'EmailDuplicate', message: `Email Already Exist !!`, error: err });
					} else {
						res.status(400).send({ status: false, errno: 1062, message: `UserName Or Email Already Exist !!`, error: err });
					}
				} else {
					res.status(500).send({ status: false, message: `Error Edit User ${err}` });
				}
			}
			else {
				res.send({ status: true, Message: "Update User Success" });
			}
		});
	} else {
		if (req.body.Password.length >= 8 && req.body.Password.length <= 16) {
			hashPassword(req.body.Password, function (error, hash) {
				if (error) {
					res.status(500).send({ message: "Server Error !!" });
				} else {
					var que = "update User set FullName=?,Email=?,HashPassword=?,GroupID=?  where ID=?"

					var p = [req.body.FullName, req.body.Email, hash, req.body.GroupID, req.body.ID]

					var queryObj = con.query({ 'sql': que }, p, function (err, result) {
						if (err) {
							if (err.errno === 1062 && err.code === 'ER_DUP_ENTRY') {
								if (err.message.indexOf('FullName_UNIQUE_1062') !== -1) {
									res.status(400).send({ status: false, errno: 1062, errorType: 'UserNameDuplicate', message: `UserName Already Exist !!`, error: err });
								} else if (err.message.indexOf('Email_UNIQUE_1062') !== -1) {
									res.status(400).send({ status: false, errno: 1062, errorType: 'EmailDuplicate', message: `Email Already Exist !!`, error: err });
								} else {
									res.status(400).send({ status: false, errno: 1062, message: `UserName Or Email Already Exist !!`, error: err });
								}
							} else {
								res.status(500).send({ status: false, message: `Error Edit User ${err}` });
							}
						} else {
							res.status(200).send({ status: true, message: 'User Edited Successfully !!' });
						}
					});
				}
			});
		} else {
			res.status(400).send({ status: false, message: `Invalid Password` });
		}
	}
}

module.exports.getUsers = getUsers;
module.exports.deleteUsers = deleteUsers;
module.exports.EditUser = EditUser;