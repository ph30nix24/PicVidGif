import axios from "axios"

const GIFS_API = `${import.meta.env.VITE_BACKEND_UPI}/picVidGif/v1/gifs`

export const getGifs = async (query) => {
    try {
        const response = await axios.get(`${GIFS_API}/search`, {
            params: { query, page: 1, per_page: 20 },
            withCredentials: true
        })
        return response.data.data
    } catch (error) {
        console.log("Error while fetching images", error.response?.data || error.message)
        throw error
    }
}

export const getPopularGifs = async () => {
    try {
        const response = await axios.get(`${GIFS_API}/tranding`, {
            params: { limit: 20 },
            withCredentials: true
        })
        return response.data.data
    } catch (error) {
        console.log("Error while fetching images", error.response?.data || error.message)
        throw error
    }
}