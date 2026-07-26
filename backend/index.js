import './src/loadEnv.js'
import app from './src/app.js'
import connectDb from './src/db/index.js'


const PORT = process.env.PORT || 8000


connectDb().then(async () => {
    await app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
})