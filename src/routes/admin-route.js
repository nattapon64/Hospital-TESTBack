
const express = require('express')
const Authenticate = require('../middlewares/Auth')
const adminController = require('../controllers/admin-controllers')
const router = express.Router()

router.get('/roleuser', Authenticate, adminController.roleUser);
router.get('/user',Authenticate, adminController.searchUser)
router.get('/reportuser/:typeuser', Authenticate,adminController.reportuser)
router.get('/reportsumuser', Authenticate,adminController.reportsumuser)
router.get('/addusersystem', Authenticate, adminController.getAddusersystem)

router.post('/postaddusersystem', Authenticate, adminController.postAddusersystem)

router.patch('/updateuser/:userID', Authenticate, adminController.updateUser)

module.exports = router