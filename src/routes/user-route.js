const express = require('express')
const Authenticate = require('../middlewares/Auth')
const userAuthenticate = require('../controllers/user-controllers')
const router = express.Router()

router.patch('/updatepass/:userID', Authenticate, userAuthenticate.updateUser)
router.get('/reportUserOT/:CID', Authenticate,userAuthenticate.reportUserOT)

module.exports = router