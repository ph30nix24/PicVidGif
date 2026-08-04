import axios from "axios"

const VIDEO_API = `${import.meta.env.VITE_BACKEND_URI}/picVidGif/v1/video`

export const getVideos = async (query) => {
    try {
        const response = await axios.get(`${VIDEO_API}/search`, {
            params: { query, page: 1, per_page: 20 },
            withCredentials: true
        })
        return response.data.data
    } catch (error) {
        console.log("Error while fetching images", error.response?.data || error.message)
        throw error
    }
}

export const getPopular = async () => {
    try {
        const response = await axios.get(`${VIDEO_API}/popular`, {
            params: { count: 20 },
            withCredentials: true
        })
        return response.data.data
    } catch (error) {
        console.log("Error while fetching images", error.response?.data || error.message)
        throw error
    }
}