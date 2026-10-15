import dotenv from 'dotenv'
import express from 'express'

import connectDB from './config/db.js'
import authRouter from './routes/auth.router.js'

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded())

app.use('/api/auth',authRouter)

app.listen(PORT,() => {
    console.log("server running")
})