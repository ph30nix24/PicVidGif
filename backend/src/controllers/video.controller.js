import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"

const PEXELS_BASE = "https://api.pexels.com"

const pexelsFetch = async (path, params = {}) => {
    const url = new URL(`${PEXELS_BASE}${path}`)
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.set(key, value)
        }
    })

    const response = await fetch(url, {
        headers: {
            Authorization: process.env.PEXELS_API_KEY
        }
    })

    if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new ApiError(response.status, body?.error || "Failed to fetch from Pexels")
    }

    return response.json()
}

export const searchVideos = async (req, res, next) => {
    try {
        const { query, page = 1, per_page = 20 } = req.query

        if (!query) {
            throw new ApiError(400, "Query parameter is required")
        }

        const data = await pexelsFetch("/videos/search", { query, page, per_page })
        return res.status(200).json(new ApiResponse(200, data, "videos fetched successfully"))
    } catch (e) {
        next(e)
    }
}

export const getPopularVideos = async (req, res, next) => {
    try {
        const { page = 1, per_page = 20 } = req.query
        const data = await pexelsFetch("/videos/popular", { page, per_page })
        return res.status(200).json(new ApiResponse(200, data, "popular videos fetched successfully"))
    } catch (e) {
        next(e)
    }
}

