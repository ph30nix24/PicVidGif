import { Router } from 'express'
import { getTrendingGifs, searchGifs } from '../controllers/gif.controller.js'

const gifRouter = Router()

gifRouter.get('/search', searchGifs)

gifRouter.get('/tranding', getTrendingGifs)

export default gifRouter