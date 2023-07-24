const express = require('express')
const router = express.Router()
const connection = require('../dataBase/db_perpusDigital')
const multer = require("multer")
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({ storage: storage });

router.post('/uploadBuku', upload.single('pdfFile'), (req, res) => {

    if (!req.file) {
        return res.status(400).send('File tidak ditemukan.');
    }

    res.send('File berhasil di-upload.');
});

router.post('/uploadCoverBuku', upload.single('imageFile'), (req, res) => {

    if (!req.file) {
        return res.status(400).send('File tidak ditemukan.');
    }

    res.send('File berhasil di-upload.');
})


router.get('/', async (req, res) => {
    connection.query('SELECT * FROM data_buku ORDER BY bukuID', function (err, rows) {
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
    const { judulBuku, kategoriBuku, deskripsi, jumlah, emailUser } = req.body

    connection.query(`SELECT * FROM user WHERE email = "${emailUser}"`, function (err, resultUser) {
        if (resultUser[0] == null) {
            res.status(400).json({
                error: "data invalid"
            })
        } else {
            connection.query(`INSERT INTO data_buku (judulBuku, kategoriBuku, deskripsiBuku, kuantitas, createdByUserID)  VALUES ("${judulBuku}", "${kategoriBuku}", "${deskripsi}", "${jumlah}", ${resultUser[0].userID})`, (err, result) => {
                if (err) throw err
                res.status(200).json({
                    registered: result,
                    metadata: "created successfully"
                })
            })
        }
    })
})

router.put('/updatedescription', async (req, res) => {
    const { judulBuku, deskripsiBaru, emailUser } = req.body
    connection.query(`SELECT * FROM user WHERE email = "${emailUser}"`, function (err, resultUser) {
        if (resultUser[0] == null) {
            res.status(400).json({
                status: false,
                error: "data invalid"
            })
        } else {
            connection.query(`SELECT * FROM data_buku WHERE judulBuku = "${judulBuku}"`, function (err, resultBuku) {
                if (resultUser[0].kategoriUser == "admin" || resultUser[0].userID == resultBuku[0].createdByUserID) {
                    connection.query(`UPDATE data_buku SET deskripsiBuku = "${deskripsiBaru}" WHERE judulBuku="${judulBuku}"`, function (err, rows) {
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
                }
            })
        }
    })
})

router.put('/updatequantity', async (req, res) => {
    const { judulBuku, kuantitasBaru, emailUser } = req.body
    connection.query(`SELECT * FROM user WHERE email = "${emailUser}"`, function (err, resultUser) {
        if (resultUser[0] == null) {
            res.status(400).json({
                status: false,
                error: "data invalid"
            })
        } else {
            connection.query(`SELECT * FROM data_buku WHERE judulBuku = "${judulBuku}"`, function (err, resultBuku) {
                if (resultUser[0].kategoriUser == "admin" || resultUser[0].userID == resultBuku[0].createdByUserID) {
                    connection.query(`UPDATE data_buku SET kuantitas = "${kuantitasBaru}" WHERE judulBuku="${judulBuku}"`, function (err, rows) {
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
                }
            })
        }
    })
})

router.delete('/delete', async (req, res) => {
    const { judulBuku, emailUser } = req.body
    connection.query(`SELECT * FROM user WHERE email = "${emailUser}"`, function (err, resultUser) {
        if (resultUser[0] == null) {
            res.status(400).json({
                status: false,
                error: "data invalid"
            })
        } else {
            connection.query(`SELECT * FROM data_buku WHERE judulBuku = "${judulBuku}"`, function (err, resultBuku) {
                if (resultUser[0].kategoriUser == "admin" || resultUser[0].userID == resultBuku[0].createdByUserID) {
                    connection.query(`DELETE FROM data_buku WHERE judulBuku="${judulBuku}"`, function (err, rows) {
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
                }
            })
        }
    })

})

router.get('/export-pdf', (req, res) => {
    connection.query('SELECT * FROM data_buku', (err, data) => {
        if (err) {
            return res.status(500).send('Terjadi kesalahan saat mengambil data dari database.')
        }

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename=data.pdf')

        const doc = new PDFDocument();

        doc.pipe(res)
        doc.fontSize(12).text('Data Exported to PDF', { align: 'center' })
        doc.moveDown()
        data.forEach((item) => {
            doc.fontSize(10).text(`${data[0].bukuID},"${data[0].judulBuku}","${data[0].kategoriBuku}","${data[0].deskripsiBuku}",${data[0].kuantitas}`);
            doc.moveDown()
        })
        doc.end()
    })
})

router.get('/export-excel', (req, res) => {
    connection.query('SELECT * FROM data_buku', (err, data) => {
        console.log(data)
        if (err) {
            return res.status(500).send('Terjadi kesalahan saat mengambil data dari database.')
        }

        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Data')

        worksheet.columns = [
            { header: 'Buku ID', key: 'bukuID', width: 10 },
            { header: 'Judul Buku', key: 'judulBuku', width: 30 },
            { header: 'Kategori Buku', key: 'kategoriBuku', width: 20 },
            { header: 'Deskripsi Buku', key: 'deskripsiBuku', width: 50 },
            { header: 'Kuantitas Buku', key: 'kuantitas', width: 10 },
          ]

          data.forEach((item) => {
            worksheet.addRow(item)
          })
        
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
          res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx')
        
          workbook.xlsx.write(res)
            .then(() => {
              res.end()
            })
            .catch((err) => {
              console.log(err)
              res.status(500).send('Terjadi kesalahan saat mengekspor data ke Excel.')
            })
        })
})

module.exports = router