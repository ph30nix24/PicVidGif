import mongoose, { Schema } from "mongoose";

const blacklistSchema = new Schema({
    session : {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: '1d' } // Automatically remove expired tokens after 1 day
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Blacklisted = mongoose.model("Blacklisted", blacklistSchema);

export default Blacklisted