import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"

const UNSPLASH_BASE = "https://api.unsplash.com"

const unsplashFetch = async (path, params = {}) => {
    const url = new URL(`${UNSPLASH_BASE}${path}`)
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.set(key, value)
        }
    })

    const response = await fetch(url, {
        headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
    })

    if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new ApiError(response.status, body?.errors?.[0] || "Failed to fetch from Unsplash")
    }

    return response.json()
}

export const searchImages = async (req, res, next) => {
    try {
        const { query, page = 1, per_page = 20 } = req.query

        if (!query) {
            throw new ApiError(400, "Query parameter is required")
        }

        const data = await unsplashFetch("/search/photos", { query, page, per_page })
        return res.status(200).json(new ApiResponse(200, data, "images fetched successfully"))
    } catch (e) {
        next(e)
    }
}

export const getRandomImages = async (req, res, next) => {
    try {
        const { count = 20 } = req.query
        const data = await unsplashFetch("/photos/random", { count })
        return res.status(200).json(new ApiResponse(200, data, "random images fetched successfully"))
    } catch (e) {
        next(e)
    }
}
