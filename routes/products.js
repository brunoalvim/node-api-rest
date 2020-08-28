const express = require('express')
const router  = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).send({
        message: 'Usando o método GET dentro da rota de produtos'
    })
})

router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    }

    res.status(201).send({
        message: 'Usando o método POST dentro da rota de produtos',
        created_product: product
    })
})

router.get('/:product_id', (req, res, next) => {
    const id = req.params.product_id

    if (id === 'especial') {
        res.status(200).send({
            message: 'Você descobriu o id Especial',
            id: id
        })    
    } else {
        res.status(200).send({
            message: 'Usando o método GET dentro da rota de produtos para um produto expecífico',
            id: id
        })    
    }
})

module.exports = router
