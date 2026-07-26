import { Schema } from "mongoose"

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: function () {
            return this.authProvider === "local"
        },
        select: false,
    },
    authProvider: {
        type: String,
        enum: ["local", "firebase"],
        required: true,
        default: "local",
    },
    firebaseUID: {
        type: String,
        unique: true,
        sparse: true, // allows multiple docs with no firebaseUID without violating uniqueness
    },
    isVerified: {
        type: Boolean,
        default: false, // local users verify via email link; firebase users can default true
    },
    avatar: {
        type: String,
        default: "",
    },
},{ timestamps: true })

