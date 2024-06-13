
const express = require('express')
const Authenticate = require('../middlewares/Auth')
const adminController = require('../controllers/admin-controllers')
const router = express.Router()

router.get('/roleuser', Authenticate, adminController.roleUser);
router.patch('/updateuser/:userID', Authenticate, adminController.updateUser)
router.get('/user/:card',Authenticate, adminController.searchUser)
router.get('/reportuser/:typeuser', Authenticate,adminController.reportuser)
router.get('/reportsumuser', Authenticate,adminController.reportsumuser)

module.exports = router