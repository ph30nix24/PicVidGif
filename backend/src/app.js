import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_API,
    credentials: true
}))

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());


app.get('/', (req, res) => {
    res.status(200).json({ message: "Server is Up!"})
})

import authRouter from './routes/auth.routes.js';
app.use('/picVidGif/v1/auth', authRouter)








import errorHandler from './middlewares/errorHandler.middleware.js'
app.use(errorHandler)
export default app;