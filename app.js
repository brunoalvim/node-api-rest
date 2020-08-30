const express      = require('express')
const app          = express()
const morgan       = require('morgan')
const bodyParser   = require('body-parser')

const rotaUsuarios = require('./routes/users.js')
const rotaProdutos = require('./routes/products')
const rotaPedidos  = require('./routes/orders')

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req,res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.methods === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, ´POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next();
});

app.use('/users', rotaUsuarios)
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
