const express = require('express')
const router  = express.Router()
const mysql   = require('../mysql').pool

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
 
        conn.query(
            `SELECT     orders.order_id,
                        orders.quantity,
                        products.product_id,
                        products.name,
                        products.price
             FROM       orders
             INNER JOIN products
                     ON products.product_id = orders.product_id_fk`,
            (error, result, field) => {
                if (error) { return res.status(500).send({error: error}) }

                const response = {
                    quantity_orders: result.length,
                    order: result.map(order => {
                        return {
                            order_id: order.order_id,
                            quantity: order.quantity,
                            product: {
                                product_id: order.product_id,
                                name: order.name,
                                price: order.price
                            },
                            request: {
                                type: 'GET',
                                description: 'Retorna um pedido específico.',
                                url: 'http://localhost:3000/orders/' + order.order_id
                            }
                        }
                    })
                }
    
                return res.status(200).send({response})
            }
        )
    })
})

router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query('SELECT * FROM products WHERE product_id = ?',
            [req.body.product_id],
            (error, result, field) => {
                if (error) { return res.status(500).send({error: error}) }

                if (result.length == 0) {
                    return res.status(404).send({
                        message: 'Produto não encontrado.'
                    })
                }
            }
        )

        conn.query(
            'INSERT INTO orders (product_id_fk, quantity) VALUES (?, ?)',
            [req.body.product_id, req.body.quantity],
            (error, result, field) => {
                conn.release()
    
                if (error) { return res.status(500).send({error: error}) }

                const id       = result.insertId 
                const response = {
                    message: 'Pedido inserido com sucesso.',
                    createdOrder: {
                        order_id: id,
                        product_id: req.body.product_id,
                        quantity: req.body.quantity,
                        request: {
                            type: 'GET',
                            description: 'Retorna um pedido específico.',
                            url: 'http://localhost:3000/orders/' + id
                        }
                    }
                }

                return res.status(201).send({response})
            }
        )
    })
})

router.get('/:order_id', (req, res, next) => {
    const id = req.params.order_id

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM orders WHERE order_id = ?',
            [id],
            (error, result, field) => {
                if (error) { return res.status(500).send({error: error}) }

                if (result.length == 0) {
                    return res.status(404).send({
                        message: 'Não foi encontrado pedido com o ID: ' + id
                    })
                }

                const response = {
                    order: {
                        order_id: result[0].order_id,
                        product_id: result[0].product_id_fk,
                        quantity: result[0].quantity,
                        request: {
                            type: 'GET',
                            description: 'Retorna todos os pedidos.',
                            url: 'http://localhost:3000/orders/'
                        }
                    }
                }
                
                return res.status(200).send({response})
            }
        )
    })
})

router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE orders SET
                product_id_fk = ?, 
                quantity      = ?
             WHERE order_id   = ?`,
            [
                req.body.product_id, 
                req.body.quantity, 
                req.body.order_id
            ],
            (error, result, field) => {
                conn.release()
    
                if (error) { return res.status(500).send({error: error}) }

                const response = {
                    message: 'Pedido atualizado com sucesso.',
                    updatedOrder: {
                        order_id: req.body.order_id,
                        product_id: req.body.product_id,
                        quantity: req.body.quantity,
                        request: {
                            type: 'GET',
                            description: 'Retorna um pedido específico.',
                            url: 'http://localhost:3000/orders/' + req.body.order_id
                        }
                    }
                }

                return res.status(202).send(response)
            }
        )
    })
})

router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `DELETE FROM orders WHERE order_id = ?`, [req.body.order_id],
            (error, result, field) => {
                conn.release()
    
                if (error) { return res.status(500).send({error: error}) }

                const response = {
                    message: 'Pedido removido com sucesso.',
                    request: {
                        type: 'POST',
                        description: 'Insere um novo pedido.',
                        url: 'http://localhost:3000/orders',
                        body: {
                            product_id: 'Number',
                            quantity: 'Number'
                        }
                    }
                }
    
                return res.status(202).send(response)
            }
        )
    })
})

module.exports = router
