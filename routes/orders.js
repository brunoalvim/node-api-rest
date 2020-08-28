const express = require('express')
const router  = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).send({
        message: 'Retorna todos os Pedidos'
    })
})

router.post('/', (req, res, next) => {
    res.status(201).send({
        message: 'Adiciona um Pedido'
    })
})

router.get('/:order_id', (req, res, next) => {
    const id = req.params.order_id

    res.status(200).send({
        message: 'Retorna um Pedido expecífico',
        id: id
    })    
})

module.exports = router
