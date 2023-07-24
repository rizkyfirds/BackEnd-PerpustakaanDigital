const express = require('express')
const router = express.Router()
const connection = require('../dataBase/db_perpusDigital')

router.post('/login', async (req, res) => {
    const { email, pass } = req.body
    try {
        connection.query(`SELECT * FROM user WHERE email="${email}" AND password = "${pass}"`, (err, result) => {
            if(result[0]==null){
                res.status(400).json({
                    error: "data invalid"
                })
            }else{
                res.status(200).json({
                    userData: result,
                    metadata: "Login Success"
                })  
            }
        })
    } catch {
        res.status(400).json({
            error: "data invalid"
        })
    }
})

router.post('/register', async (req, res) => {
    const { nama, email, pass, kategoriUser } = req.body

    connection.query(`INSERT INTO user (nama, email,password,kategoriUser)  VALUES ("${nama}","${email}", "${pass}", "${kategoriUser}")`, (err, result) => {
        if (err) throw err
        res.status(200).json({
            registered: result,
            metadata: "register success"
        })
    })
})

module.exports = router