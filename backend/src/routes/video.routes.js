import { Router } from 'express'
import { getPopularVideos, searchVideos } from '../controllers/video.controller.js';

const videoRouter = Router();

videoRouter.get('/video/search', searchVideos)

videoRouter.get('/video/popular', getPopularVideos)

export default videoRouter;