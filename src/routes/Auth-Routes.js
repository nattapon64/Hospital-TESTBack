const exprees = require('express')
const Authcontrollers = require('../controllers/Auth-Controllers')
const Authenticate = require('../middlewares/Auth')
const router = exprees.Router()


router.post("/register", (Authcontrollers.register))
router.post("/login", Authcontrollers.login)
router.get("/me", Authenticate,Authcontrollers.getme)



module.exports = router