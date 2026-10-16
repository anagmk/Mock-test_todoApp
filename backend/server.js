import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

import connectDB from './config/db.js'
import authRouter from './routes/auth.router.js'
import todoRouter from './routes/todo.routes.js'

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth',authRouter)
app.use('/api/todo',todoRouter)

app.listen(PORT,() => {
    console.log("server running")
})