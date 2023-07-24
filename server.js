const express = require('express')
const cors = require('cors')
const port = 3003

const userEndpoint = require('./routes/user')
const bukuEndpoint = require('./routes/dataBuku')
const kategoriBukuEndpoint = require('./routes/kategoriBuku')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/user', userEndpoint)
app.use('/buku', bukuEndpoint)
app.use('/kategoriBuku', kategoriBukuEndpoint)

app.listen(port, () =>  console.log(`running server on port ${port}`))