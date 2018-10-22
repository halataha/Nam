const bcrypt = require('bcrypt-nodejs');
const mysql = require('mysql');
// const validator = require('validator');
// const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
// const app = express();
var con = Connection.myConnection;

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

function register(req, res) {

    // if (req.Email && validator.isEmail(req.Email)) {
        if (req.Password && req.Password.length >= 8 && req.Password.length <= 16) {
            if (req.FullName && !req.FullName.includes(' ') && req.FullName.length >= 3 && req.FullName.length <= 20) {
                if (req.GroupID && !isNaN(req.GroupID)) {
                    hashPassword(req.Password, function (error, hash) {
                        if (error) {
                            res.status(500).send({ message: "Server Error !!" });
                        } else {
                            var query = "insert into User(Email,HashPassword,FullName,GroupID) values(?,?,?,?)"
                            var param = [req.Email, hash, req.FullName, req.GroupID]
                            var queryObj = con.query({ 'sql': query }, param, function (err, result) {
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
                                        res.status(500).send({ status: false, message: `Error Add User ${err}` });
                                    }
                                } else {
                                    res.status(200).send({ status: true, message: 'User Created Successfully !!' });
                                }
                            });
                        }
                    });
                } else {
                    res.status(400).send({ status: false, message: `Invalid GroupID` });
                }
            } else {
                res.status(400).send({ status: false, message: `Invalid UserName` });
            }
        } else {
            res.status(400).send({ status: false, message: `Invalid Password` });
        }
    // } else {
    //     res.status(400).send({ status: false, message: `Invalid Email` });
    // }
}

module.exports.register = register;