import { Router } from "express";
import { login } from "../controllers/auth.controller.js";

const authRouter = Router()

/**
 * @name    loginRoute
 * @desc    login route for oauth and recieves token in input 
 * @route   POST /picVidGif/auth/v1/
 * @access  public
 */
authRouter.post('/', login);



export default authRouter