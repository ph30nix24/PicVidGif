import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.status(200).json({ message: "Server is Up!"})
})

import authRouter from './routes/auth.routes.js';
app.use('/picVidGif/auth/v1', authRouter)








import errorHandler from './middlewares/errorHandler.middleware.js'
app.use(errorHandler)
export default app;