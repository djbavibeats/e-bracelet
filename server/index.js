import express, { Router } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import spotify from './spotify.js'
import database from './database.js'

dotenv.config()

const PORT = 8080

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '50mb' }))

app.get('/api', (req, res) => {
    res.json({
        message: 'hi from the server!'
    })
})

app.use('/spotify', spotify)
app.use('/database', database)

app.listen(PORT, () => {
    console.log(`server is up at port ${PORT}`)
})