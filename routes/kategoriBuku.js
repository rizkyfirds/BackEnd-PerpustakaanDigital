const express = require('express')
const router = express.Router()
const connection = require('../dataBase/db_perpusDigital')

router.get('/', async (req, res) => {
    connection.query('SELECT * FROM data_kategori_buku ORDER BY namaKategori', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            })
        } else {
            return res.status(200).json({
                status: true,
                message: "Get Users Success",
                data: rows
            })
        }
    })
})

router.post('/create', async (req, res) => {
    const { namaKategori } = req.body

    connection.query(`INSERT INTO data_kategori_buku (namaKategori)  VALUES ("${namaKategori}")`, (err, result) => {
        if (err) throw err
        res.status(200).json({
            registered: result,
            metadata: "created successfully"
        })
    })
})

router.put('/update', async (req, res) => {
    const { newNamaKategori,oldNamaKategori } = req.body
    connection.query(`UPDATE data_kategori_buku SET namaKategori = "${newNamaKategori}" WHERE namaKategori="${oldNamaKategori}"`, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "server error"
            })
        } else {
            return res.status(200).json({
                status: true,
                message: "updated successfully"
            })
        }

    })

})

router.delete('/delete', async (req, res) => {
    const { namaKategori } = req.body
    connection.query(`DELETE FROM data_kategori_buku WHERE namaKategori="${namaKategori}"`, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "server error"
            })
        } else {
            return res.status(200).json({
                status: true,
                message: "deleted successfully"
            })
        }

    })

})

module.exports = router