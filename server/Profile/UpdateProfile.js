const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const app = express();
var con = Connection.myConnection;

function UpdateProfile(req, res) {
    var query = `update User set Image=? where ID=?`;

    var param = [req.Image, req.ID];

    var queObj = con.query({ 'sql': query }, param, function (err, result) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send({ imgSrc: req.Image });
        }
    });
}

module.exports.UpdateProfile = UpdateProfile;