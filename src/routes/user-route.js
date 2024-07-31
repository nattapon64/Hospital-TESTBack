const express = require('express')
const Authenticate = require('../middlewares/Auth')
const userAuthenticate = require('../controllers/user-controllers')
const router = express.Router()

router.get('/getUserID', Authenticate, userAuthenticate.getuser)
router.get('/reportUserOT/:CID', Authenticate,userAuthenticate.reportUserOT)

router.patch('/updatepass/:userID', Authenticate, userAuthenticate.updateUser)

module.exports = router