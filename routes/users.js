const express          = require('express')
const router           = express.Router()
const UsersConstroller = require('../controllers/users-controller')

router.post('/adduser', UsersConstroller.Adduser)
router.post('/login', UsersConstroller.Login)

module.exports = router
