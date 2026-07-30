import { Router } from 'express'
import { getPopularVideos, searchVideos } from '../controllers/video.controller.js';

const videoRouter = Router();

videoRouter.get('/search', searchVideos)

videoRouter.get('/popular', getPopularVideos)

export default videoRouter;