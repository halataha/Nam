const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const express = require('express'); //use module express for routing
const app = express();
app.use(express.json());
const Connection = require('../Connection/myconnection.js'); //using module for connection
var con = Connection.myConnection;
const config = require('../config');

function comparePassword(userPassword, hashedPassword, cb) {
	bcrypt.compare(userPassword, hashedPassword, function (error, isMatch) {
		if (error)
			return cb(error);
		return cb(null, isMatch);
	});
}

function token(req, res) {

	// var query = "select * from User where FullName=(?)";

	var query = `select U.FullName,U.ID,U.Image,U.Email,U.HashPassword,gp.PrivilegeID from User as U inner join  UserGroup g
	on U.GroupID=g.ID
	inner join UserGroupPrivilege as gp
	on gp.GroupID=g.ID
	where U.FullName=(?)`

	var Param = [req.UserName]

	var queryObj = con.query({ 'sql': query }, Param, function (err, result) {
		if (err)
			res.status(500).send({ message: `Error getting data ${err}` });

		if (result.length > 0) {

			var rolesArray = [];

			result.forEach(element => {
				rolesArray.push(element.PrivilegeID);
			});

			comparePassword(req.Password, result[0].HashPassword, function (error, isMatch) {
				if (error) {
					res.status(500).send({ message: `Server Error !!` });
				}

				if (isMatch === true) {

					const payload = {
						UserID: result[0].ID,
						Email: result[0].Email,
						UserName: result[0].FullName,
						ImagePath: result[0].Image,
						Roles: rolesArray
					};

					var token = jwt.sign(payload, config.secret, {
						expiresIn: config.tokenLife // expires in 24 hours
					});

					res.status(200).send({
						success: true,
						message: `Successfull Login !!`,
						token: token
					});
				} else {
					res.status(401).send({ success: false, message: `Invalid Email Or Password !!` });
				}
			});
		}
		else {
			res.status(401).send({ message: `Invalid Email Or Password` });
		}
	});
}

module.exports.login = token;