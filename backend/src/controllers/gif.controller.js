import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"

const GIPHY_BASE = "https://api.giphy.com/v1"

const giphyFetch = async (path, params = {}) => {
    const url = new URL(`${GIPHY_BASE}${path}`)
    url.searchParams.set("api_key", process.env.GIPHY_API_KEY)
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.set(key, value)
        }
    })

    const response = await fetch(url)

    if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new ApiError(response.status, body?.meta?.msg || "Failed to fetch from Giphy")
    }

    return response.json()
}

export const searchGifs = async (req, res, next) => {
    try {
        const { query, page = 1, per_page = 20 } = req.query

        if (!query) {
            throw new ApiError(400, "Query parameter is required")
        }

        const offset = (page - 1) * per_page
        const data = await giphyFetch("/gifs/search", { q: query, limit: per_page, offset })
        return res.status(200).json(new ApiResponse(200, data, "gifs fetched successfully"))
    } catch (e) {
        next(e)
    }
}

export const getTrendingGifs = async (req, res, next) => {
    try {
        const { limit = 20 } = req.query
        const data = await giphyFetch("/gifs/trending", { limit })
        return res.status(200).json(new ApiResponse(200, data, "trending gifs fetched successfully"))
    } catch (e) {
        next(e)
    }
}