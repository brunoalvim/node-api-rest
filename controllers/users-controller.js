const mysql  = require('../mysql')
const bcrypt = require('bcrypt')
const jwt    = require('jsonwebtoken')

exports.Adduser = async (req, res, next) => {
    try {
        const query1  = `SELECT * FROM users WHERE email = ?`
        const result1 = await mysql.execute(query1, [req.body.email])

        if (result1.length > 0) {
            res.status(409).send({ message: 'Usuário já cadastrado.' })
        } else {
            bcrypt.hash(req.body.password, 10, async (errBcrypt, hash) => {
                if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }

                const query2  = `INSERT INTO users (email, password) VALUES (?, ?)`
                const result2 = await mysql.execute(query2, [req.body.email, hash])

                response = {
                    message: 'Usuário criado com sucesso.',
                    ceratedUser: {
                        user_id: result2.insertId,
                        email: req.body.email
                    }
                }
                return res.status(201).send(response)
            })
        }
    } catch (error) {
        return res.status(500).send({ error: error })        
    }
}

exports.Login = async (req, res, next) => {
    try {
        const query = `SELECT * FROM users WHERE email = ?`
        const results = await mysql.execute(query, [req.body.email])

        if (results.length < 1) { 
            return res.status(401).send({ message: 'Falha na autenticação.' })
        }

        bcrypt.compare(req.body.password, results[0].password, (error, result) => {
            if (error) { 
                return res.status(401).send({ message: 'Falha na autenticação.' }) 
            }
            if (result) { 
                const token = jwt.sign({
                    user_id: results[0].user_id,
                    email: results[0].email
                }, 
                process.env.JWT_KEY,
                {
                    expiresIn: '1h'
                })
                return res.status(200).send({ 
                    message: 'Usuário autenticado com sucesso.',
                    token: token 
                })
            }
            return res.status(401).send({ message: 'Falha na autenticação.' }) 
        })
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}
