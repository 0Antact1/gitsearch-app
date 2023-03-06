if (process.env.NODE_ENV !== 'prod') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const indexRoute = require('./routes/index')

app.set('view engine', 'ejs')
app.set('views',__dirname+'/views')
app.set('layout','layouts/layout')

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection
db.on('error', error => console.error('mc'))
db.once('open', () => console.log('done'))

app.use(expressLayouts)
app.use(express.static('public'))
app.use(indexRoute)

app.listen(process.env.PORT || 3000)