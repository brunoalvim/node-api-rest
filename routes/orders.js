const express          = require('express')
const router           = express.Router()
const OrdersController = require('../controllers/orders-controller')

router.get('/', OrdersController.getOrders)
router.get('/:order_id', OrdersController.getOrder)
router.post('/', OrdersController.postOrder)
router.patch('/', OrdersController.patchOrder)
router.delete('/:order_id', OrdersController.deleteOrder)

module.exports = router
