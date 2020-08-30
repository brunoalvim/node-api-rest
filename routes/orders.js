const express          = require('express')
const router           = express.Router()
const OrdersController = require('../controllers/orders-controller')
const login            = require('../middleware/login')

router.get('/', OrdersController.getOrders)
router.get('/:order_id', OrdersController.getOrder)
router.post('/', login.required, OrdersController.postOrder)
router.patch('/', login.required, OrdersController.patchOrder)
router.delete('/:order_id', login.required, OrdersController.deleteOrder)

module.exports = router
