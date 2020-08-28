const express      = require('express')
const app          = express()
const morgan       = require('morgan')
const rotaProdutos = require('./routes/products')
const rotaPedidos  = require('./routes/orders')

app.use(morgan('dev'))

app.use('/products', rotaProdutos)
app.use('/orders', rotaPedidos)

app.use((req, res, next) => {
    const error = new Error('Rota não encotrada.')

    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)

    return res.send({
        error: {
            message: error.message
        }
    })
})

module.exports = app
