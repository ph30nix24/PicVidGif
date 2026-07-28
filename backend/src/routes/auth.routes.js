import { Router } from "express";
import { getUser, login } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const authRouter = Router()

/**
 * @name    loginRoute
 * @desc    login route for oauth and recieves token in input 
 * @route   POST /picVidGif/auth/v1/
 * @access  public
 */
authRouter.post('/', login);

/**
 * @name    getUserRoute
 * @desc    get currentUser 
 * @route   GET /picVidGif/auth/v1/
 * @access  public
 */
authRouter.get('/', protect, getUser)



export default authRouter