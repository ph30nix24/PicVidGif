import { Collection } from "../models/collection.model.js"
import ApiResponse from "../utils/ApiResponse.js";


export const getOrCreateCollection = async (req, res, next) => {
    try {
        let collection = await Collection.findOne({ user: req.user._id })
        if (!collection) {
            collection = await Collection.create({ user: req.user._id, name: `${req.user.name}'s Collection` });
        }

        return res.status(200).json(new ApiResponse(200, collection, "Collection fetched successfully"))

    } catch (e) {
        next(e)
    }
}


export const addItemToCollection = async (req, res, next) => {
    try {
        const { sourceId, type, url, thumbnailUrl, description } = req.body;

        const collection = await Collection.findOneAndUpdate(
            { user: req.user._id, "items.sourceId": { $ne: sourceId } }, // skip if already saved
            {
                $push: {
                    items: { sourceId, type, url, thumbnailUrl, description }
                }
            },
            { new: true }
        );

        if (!collection) {
            return res.status(409).json(new ApiResponse(409, null, "Item already in collection"));
        }

        return res.status(200).json(new ApiResponse(200, collection, "Item added to collection"))
    } catch (e) {
        next(e)
    }
}

export const removeItemFromCollection = async (req, res, next) => {
    try {
        const { sourceId } = req.params;

        const collection = await Collection.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { items: { sourceId } } },
            { new: true }
        );

        if (!collection) {
            return res.status(404).json(new ApiResponse(404, null, "Collection not found"));
        }

        return res.status(200).json(new ApiResponse(200, collection, "Item removed from collection"))
    } catch (e) {
        next(e)
    }
}