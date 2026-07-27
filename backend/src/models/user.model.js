import mongoose, { Schema } from "mongoose"

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
    firebaseUID: {
        type: String,
        unique: true,
        sparse: true, // allows multiple docs with no firebaseUID without violating uniqueness
    },
    isVerified: {
        type: Boolean,
        default: false, 
    },
    avatar: {
        type: String,
        default: "",
    },
},{ timestamps: true })


const User = mongoose.model('user', userSchema);

export default User;