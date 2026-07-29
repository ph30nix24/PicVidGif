import mongoose, { Schema } from "mongoose";

const mediaItemSchema = new Schema(
    {
        sourceId: {
            type: String,
            required: true // Unsplash's id for the photo/video/gif
        },
        type: {
            type: String,
            enum: ["image", "video", "gif"],
            required: true
        },
        url: {
            type: String,
            required: true // full-res or download url
        },
        thumbnailUrl: {
            type: String
        },
        description: {
            type: String,
            trim: true,
            default: ""
        }
    },
    { _id: false, timestamps: { createdAt: "savedAt", updatedAt: false } }
);

const collectionSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        items: [mediaItemSchema],
        isPublic: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

collectionSchema.index({ user: 1, name: 1 }, { unique: true });

export const Collection = mongoose.model("Collection", collectionSchema);