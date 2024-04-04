import express, { Router } from 'express'
import axios from 'axios'
import 'dotenv/config'
const router = express.Router()

router.post('/begin', (req, res) => {
    console.log('starting ar', req.body.user)
    return res.send({
        status: 200,
        message: "Starting AR"
    })
})

router.post('/end', (req, res) => {
    console.log('ending ar')
    return res.send({
        status: 200,
        message: 'Ending AR'
    })
})

export default router