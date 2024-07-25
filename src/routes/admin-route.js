
const express = require('express')
const Authenticate = require('../middlewares/Auth')
const adminController = require('../controllers/admin-controllers')
const router = express.Router()

router.get('/roleuser', Authenticate, adminController.roleUser);
router.get('/Tmouth', Authenticate, adminController.Tmouth)
router.get('/searchUserID', Authenticate, adminController.searchUserID)
router.get('/user*', Authenticate, adminController.searchUser);
router.get('/reportuser/:type', Authenticate, adminController.reportuser);
router.get('/reportsumuser', Authenticate, adminController.reportsumuser);
router.get('/addusersystem', Authenticate, adminController.getAddusersystem);
router.get('/reportsumuseBA_NULL', adminController.getReportsumuseBA_NULL);
router.get('/reportsumuseBA_NOTNULL', adminController.getReportsumuseBA_NOTNULL);
router.get('/reportsumtypeOT', Authenticate, adminController.getreportsumtypeOT);
router.get('/getAddtypeOT', Authenticate, adminController.getAddtypeOT)
router.get('/reportsumOTU01', Authenticate, adminController.reportsumOTU01)
router.get('/ReMoOTDetai02*', Authenticate, adminController.ReMoOTDetai02)

router.post('/postaddusersystem', Authenticate, adminController.postAddusersystem);
router.post('/postAddtypeOT', Authenticate, adminController.postAddtypeOT)
router.post('/upload', Authenticate, adminController.upload)

router.patch('/updateuser/:userID', Authenticate, adminController.updateUser);
router.patch('/updateReMoOTDetai02/:monthOTU',Authenticate,adminController.updateReMoOTDetai02)

router.delete('/DeleteAddtypeOT/:typeot_ID', Authenticate, adminController.DeleteAddtypeOT)
router.delete('/DeleteReMoOTDetai02/:ID', Authenticate, adminController.DeleteReMoOTDetai02)

module.exports = router