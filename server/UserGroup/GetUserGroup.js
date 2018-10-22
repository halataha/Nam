const express = require('express'); //use module express for routing
const Connection = require('../Connection/myconnection.js'); //using module for connection
const app = express();
var con = Connection.myConnection;


function GetGroupPrivilege(req, res) {


	con.query(`select Name,ID from privilege;select Name,ID from UserGroup;select distinct u.Name as GroupName,u.ID as GroupID, p.Name as PrivilegeName,p.ID as PrivilegeID
             from openmind_Namaa.UserGroup as u,openmind_Namaa.privilege as p, openmind_Namaa.UserGroupPrivilege as up
             where  up.PrivilegeID=p.ID and up.GroupID=u.ID`, [1, 2, 3], function (err, results) {
			if (err) throw err;
			var groupRolesData = results[2];
			// console.log(results[0]);
			var arr = [];
			for (let index = 0; index < groupRolesData.length; index++) {
				var groupIndex = arr.findIndex(a => a.GroupID === groupRolesData[index].GroupID);
				if (groupIndex === -1) {
					arr.push({
						GroupID: groupRolesData[index].GroupID,
						GroupName: groupRolesData[index].GroupName,
						Roles: [{
							RoleID: groupRolesData[index].PrivilegeID,
							RoleName: groupRolesData[index].PrivilegeName
						}]
					});
				} else {
					arr[groupIndex].Roles.push({ RoleID: groupRolesData[index].PrivilegeID, RoleName: groupRolesData[index].PrivilegeName });
				}
			}
			// `results` is an array with one element for every statement in the query:
			res.send({ groupsNames: results[1], rolesNames: results[0], groupsRoles: arr });
		});

}


function AddGroupPrivilege(req, res) {
	var query = "insert into UserGroupPrivilege(GroupID,PrivilegeID) values(?,?)";
	var param = [req.body.GroupID, req.body.PrivilegeID];
	var queryObj = con.query({ 'sql': query }, param, function (err, result) {
		if (err) {
			res.send('Error Insert UserGroupPrivilege' + err);
		}
		else {
			res.send({ status: true, message: 'AddGroupPrivilege Success' });
		}
	});
}

function SaveGroupPrivilege(req, res) {

	var insertedRecords = [];

	for (var i = 0; i < req.body.length; i++) {
		insertedRecords.push([req.body[i].GroupID, req.body[i].RoleID]);
	}

	var q = "Truncate table UserGroupPrivilege;";
	var quObj = con.query({ 'sql': q }, function (err, result) {

		if (err) {
			console.log('Err Deleted Group Privilege' + err);
			res.send({ status: true, message: "error" });
		}
		else {
			insertGroupPrivilege(insertedRecords, res);
		}
	});
}

function insertGroupPrivilege(insertedList, res) {
	var sql = "insert into UserGroupPrivilege (GroupID,PrivilegeID) VALUES ?";

	var quer = con.query(sql, [insertedList], function (err, result) {
		if (err) {
			console.log('Error insert user group privilege' + err);
			res.send({ status: true, message: "error" });
		}
		else {
			console.log('success insert');
			res.send({ status: true, message: 'all Updated success' });
		}
	});
}

function getUserGroups(req, res) {
	var query44 = "select * from UserGroup";

	var queryObj222 = con.query({ 'sql': query44 }, function (err, result) {

		if (err) {
			console.log('Err Get all Groups' + err);
			res.status(500).send('Database Query Error !!');
		}
		else {
			res.send({ status: true, data: result });
		}
	});
}

module.exports.getGroupPrivilegeFun = GetGroupPrivilege;
module.exports.AddGroupPrivilegeFun = AddGroupPrivilege;
module.exports.SaveGroupPrivilegeFun = SaveGroupPrivilege;
module.exports.getUserGroupsFun = getUserGroups;