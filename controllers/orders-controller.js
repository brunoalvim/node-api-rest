const mysql = require('../mysql')

exports.getOrders = async (req, res, next) => {
    try {
        const query = `SELECT     orders.order_id,
                           orders.quantity,
                           products.product_id,
                           products.name,
                           products.price
                       FROM       orders
                       INNER JOIN products
                       ON products.product_id = orders.product_id_fk`

        const result = await mysql.execute(query)

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
                        url: process.env.URL_API + 'orders/' + order.order_id
                    }
                }
            })
        }
        return res.status(200).send({response})
    } catch (error) {
        return res.status(500).send({ error: error })                
    }
}

exports.getOrder = async (req, res, next) => {
    try {
        const id = req.params.order_id
        const query = `SELECT * FROM orders WHERE order_id = ?`
        const result = await mysql.execute(query, [id])

        const response = {
            order: {
                order_id: result[0].order_id,
                product_id: result[0].product_id_fk,
                quantity: result[0].quantity,
                request: {
                    type: 'GET',
                    description: 'Retorna todos os pedidos.',
                    url: process.env.URL_API + 'orders'
                }
            }
        }
        return res.status(200).send({response})
    } catch (error) {
        return res.status(500).send({error: error})        
    }
}

exports.postOrder = async (req, res, next) => {
    try {
        const query1  = `SELECT * FROM products WHERE product_id = ?`
        const result1 = await mysql.execute(query1, [req.body.product_id])
        const query2  = `INSERT INTO orders (product_id_fk, quantity) VALUES (?, ?)`

        if (result1.length == 0) {
            return res.status(404).send({
                message: 'Produto não encontrado.'
            })
        }

        const result2  = await mysql.execute(query2, [req.body.product_id, req.body.quantity])
        const id       = result2.insertId 
        const response = {
            message: 'Pedido inserido com sucesso.',
            createdOrder: {
                order_id: id,
                product_id: req.body.product_id,
                quantity: req.body.quantity,
                request: {
                    type: 'GET',
                    description: 'Retorna um pedido específico.',
                    url: process.env.URL_API + 'orders/' + id
                }
            }
        }
        return res.status(201).send({response})
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.patchOrder = async (req, res, next) => {
    try {
        const query = `UPDATE orders SET
                           product_id_fk = ?, 
                           quantity      = ?
                       WHERE order_id   = ?`
        
        await mysql.execute(query, [
            req.body.product_id, 
            req.body.quantity, 
            req.body.order_id
        ])
        
        const response = {
            message: 'Pedido atualizado com sucesso.',
            updatedOrder: {
                order_id: req.body.order_id,
                product_id: req.body.product_id,
                quantity: req.body.quantity,
                request: {
                    type: 'GET',
                    description: 'Retorna um pedido específico.',
                    url: process.env.URL_API + 'orders/' + req.body.order_id
                }
            }
        }
        return res.status(202).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })        
    }
}

exports.deleteOrder = async (req, res, next) => {
    try {
        const id = req.params.order_id
        const query = `DELETE FROM orders WHERE order_id = ?`

        await mysql.execute(query, [id])
        
        const response = {
            message: 'Pedido removido com sucesso.',
            request: {
                type: 'POST',
                description: 'Insere um novo pedido.',
                url: process.env.URL_API + 'orders',
                body: {
                    product_id: 'Number',
                    quantity: 'Number'
                }
            }
        }
        return res.status(202).send(response)
    } catch (error) {
        return res.status(500).send({ error: error })        
    }
}
