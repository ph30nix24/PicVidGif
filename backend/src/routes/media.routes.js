import { Router } from "express";
import { getRandomImages, searchImages } from "../controllers/media.controller.js";

const mediaRouter = Router()

/**
 * @name    searchImagesRoute
 * @desc    search images via Unsplash (query params: query, page, per_page)
 * @route   GET /picVidGif/v1/media/images/search
 * @access  public
 */
mediaRouter.get('/images/search', searchImages);

/**
 * @name    randomImagesRoute
 * @desc    get random images via Unsplash (query params: count)
 * @route   GET /picVidGif/v1/media/images/random
 * @access  public
 */
mediaRouter.get('/images/random', getRandomImages);

export default mediaRouter
