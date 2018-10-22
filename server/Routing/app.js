const express = require('express');
const app = express();
app.use(express.json()); //req.body
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use('/UploadFiles', express.static('UploadFiles'));
const morgan = require('morgan');
app.use(morgan('dev'));

const jwt = require('jsonwebtoken');
const multer = require('multer');


const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './UploadFiles/UsersImages/');
	},
	filename: function (req, file, cb) {
		if (file.mimetype === 'image/png') {
			cb(null, req.decoded.UserID + '-' + req.decoded.UserName + '.png');
		} else {
			cb(null, req.decoded.UserID + '-' + req.decoded.UserName + '.jpg');
		}
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(new Error('File Type Is Not Supported !!'), false);
	}
};

const upload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 },
	fileFilter: fileFilter
});

const config = require('../config');
var PrintRequest = require('../PrintRequest/Get.js');
var PostPrintRequest = require('../PrintRequest/Post.js');
const printing = require('../Printing/Printing');
var Sticker = require('../Sticker/GetSerial.js');
var GetPrint = require('../Sticker/GetPrint.js');
var getallsticker = require('../Sticker/GetAllStickers.js');
const loginModule = require('../Account/login');
const registerModule = require('../Account/register');
const getstore = require('../Sticker/GetStore');
const getSummary = require('../Sticker/Summary');
const getDispence = require('../Sticker/GetDispence');
const checksticker = require('../Mobil/CheckSticker');
const GetGroupPrivilege = require('../UserGroup/GetUserGroup');
const UserGroup = require('../UserGroup/UserGroup');
const User = require('../User/User');
const Report = require('../Reports/UsedNumber');
const Unlock = require('../PrintRequest/Unlock');
const updateProfile = require('../Profile/UpdateProfile');
const product = require('../Product/Product');
const Return = require('../Sticker/Return');
const RequetStatusReport = require('../Reports/RequestStatusReport');
const productionquantity = require('../Reports/ProductionQuantity');
var port = process.env.PORT || 3000;

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', '*');
		return res.status(200).json({});
	}
	next();
});

var apiRoutes = express.Router();

app.use('/api', apiRoutes);

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function (req, res, next) {

	// check header or url parameters or post parameters for token	
	var token = req.body.token || req.headers['authorization'] || req.query.token;

	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, config.secret, function (err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else {
		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
});

app.post('/token', (req, res) => {
	loginModule.login(req.body, res);
});

apiRoutes.post('/register', (req, res) => {
	registerModule.register(req.body, res);
});

apiRoutes.get('/getgroupprivilege', (req, res) => {
	GetGroupPrivilege.getGroupPrivilegeFun(req, res);
});

apiRoutes.post('/AddGroupPrivilege', (req, res) => {
	GetGroupPrivilege.AddGroupPrivilegeFun(req, res);
});

apiRoutes.post('/SaveGroupPrivilege', (req, res) => {
	//res.send(req.body[0]);
	GetGroupPrivilege.SaveGroupPrivilegeFun(req, res);
});
//home request
apiRoutes.post('/Insertfun', (req, res) => {
	//res.send(req.body[0]);
	GetGroupPrivilege.Insertfun();
});

apiRoutes.get('/PrintRequest', (req, res) => {
	PrintRequest.getprintfun(res);
});

apiRoutes.get('/getalltypes', (req, res) => {
	product.GetProductType(req, res);
});

apiRoutes.post('/addproducttype', (req, res) => {
	product.CreateProductType(req, res);
});

apiRoutes.post('/deleteproducttype', (req, res) => {
	product.deleteproductType(req, res);
});

apiRoutes.post('/editproducttype', (req, res) => {
	product.EditProductType(req, res);
});

apiRoutes.get('/GetPrinting', (req, res) => {
	printing.GetPrintingReqFunc(res);
});

apiRoutes.get('/GetAllStick', (req, res) => {
	getallsticker.getAllStickerFun(res);
});

apiRoutes.post('/PostPrintRequest', (req, res) => {
	PostPrintRequest.PostPrint(req, res);
});

apiRoutes.get('/GetSerial', (req, res) => {
	Sticker.getSerialFun(res);
});

apiRoutes.post('/getPrint', (req, res) => {
	GetPrint.getPrintFun(req, res);
});

apiRoutes.post('/GetStore', (req, res) => {
	getstore.getStoreFun(req, res);
});

apiRoutes.post('/UpdateStore', (req, res) => {
	getstore.updateStoreFun(req, res);

});

apiRoutes.post('/dispenceStickers', (req, res) => {
	getDispence.dispencefunc(req, res);
});

apiRoutes.post('/return', (req, res) => {
	Return.Return(req, res);
});

apiRoutes.post('/requetstatusreport', (req, res) => {
	RequetStatusReport.RequetStatusReport(req, res);
});

apiRoutes.post('/productionquantity', (req, res) => {
	productionquantity.ProductionQuantityReport(req, res);
});

apiRoutes.post('/getsummary', (req, res) => {
	getSummary.getSummaryFun(req, res);
});

apiRoutes.post('/getStoreSummary', (req, res) => {
	getSummary.getStoreSummary(req, res);
});

apiRoutes.post('/getDispenceSummary', (req, res) => {
	getSummary.getDispenceSummary(req, res);
});

apiRoutes.post('/ChangeStatusPrint', (req, res) => {
	GetPrint.getUpdateFun(req, res);
});
app.post('/checksticker', (req, res) => {
	
	checksticker.CheckStickerFun(req, res);
});

apiRoutes.get('/getallgroups', (req, res) => {
	GetGroupPrivilege.getUserGroupsFun(req, res);
});

apiRoutes.post('/Addgroup', (req, res) => {
	UserGroup.addUserGroup(req, res);
});

apiRoutes.post('/editgroup', (req, res) => {
	UserGroup.editUserGroup(req, res);
});

apiRoutes.post('/deletegroup', (req, res) => {
	UserGroup.deleteUserGroup(req, res);
});
apiRoutes.get('/getusers', (req, res) => {
	User.getUsers(req, res);
});
apiRoutes.post('/deleteuser', (req, res) => {
	User.deleteUsers(req, res);
});
apiRoutes.post('/EditUser', (req, res) => {
	User.EditUser(req, res);
});
apiRoutes.post('/usedNumberReport', (req, res) => {
	Report.usedNumber(req, res);
});

apiRoutes.post('/expiredNumberReport', (req, res) => {
	Report.ExpiredNumber(req, res);
});

apiRoutes.post('/repetednumberreport', (req, res) => {
	Report.RepetedNumber(req, res);
});

apiRoutes.post('/notexsistnumberreport', (req, res) => {
	Report.notExsistNumber(req, res);
});

apiRoutes.post('/UnlockPrintRequest', (req, res) => {
	Unlock.UnlockPrintRequest(req, res);
});

apiRoutes.post('/UpdateProfile', upload.single('UserImage'), (req, res) => {
	var path = req.file.path.replace('\\', '/').replace('\\', '/');
	var user = {
		ID: req.decoded.UserID,
		Image: path
	};
	updateProfile.UpdateProfile(user, res);
});

app.listen(port, () => console.log(`Magic Happens at ${port}!`));