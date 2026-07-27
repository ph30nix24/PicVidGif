import User from "../models/user.model.js";
import { getAuth } from "firebase-admin/auth"
import ApiResponse from "../utils/ApiResponse.js"
import { firebaseApp } from "../config/firebase.config.js";
import jwt from 'jsonwebtoken'


export const login = async (req, res, next) => {
    try {
        const { token } = req.body;
        const decoded = await getAuth(firebaseApp).verifyIdToken(token)

        const { name, uuid, email, picture } = decoded

        let user = await User.findOne({ firebaseUID: uuid });

        if (!user) {
            user = await User.create({
                name: name || email.split("@")[0],
                email,
                isVerified: true,
                avatar: picture,
                firebaseUID: uuid
            })
        }

        const sessionID = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("session", sessionID, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json(new ApiResponse(200, user, "successfully logged in user"))

    } catch (e) {
        next(e)
    }
}