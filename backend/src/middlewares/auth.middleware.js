import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import Blacklisted from '../models/blacklist.model.js';


export const protect = async (req, res, next) => {
    try {
        const session = req.cookies?.session;
        if(!session) {
            throw new ApiError(401,  "Session ID is required.")
        }
        const blacklistedSession = await Blacklisted.findOne({ session });
        if(blacklistedSession) {
            throw new ApiError(401, "User logged out or session expired")
        }

        const decode = jwt.verify(session, process.env.JWT_SECRET);
        const user = await User.findById(decode.id);

        if(!user) {
            throw new ApiError(400, "Session expired or user no longer exists")
        }

        req.user = user;
        next();
    } catch (e) {
        next(e)
    }
}