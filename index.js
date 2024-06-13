require('dotenv').config()
const exprees = require('express')
const cors = require('cors')
const port = process.env.PORT
const error = require('./src/middlewares/error')
const notfound = require('./src/middlewares/notFound')
const Authrouter = require('./src/routes/Auth-Routes')
const AdminRoute = require('./src/routes/admin-route')
const UserRoute = require('./src/routes/user-route')

const web = exprees()

web.use(exprees.json())
web.use(cors())

web.use("/auth", Authrouter)
web.use('/admin', AdminRoute)
web.use("/user", UserRoute)

web.use(error)
web.use("*", notfound)


web.listen(port, () => {
    console.log("kub", port)
})
