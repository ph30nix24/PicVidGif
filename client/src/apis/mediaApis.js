import axios from "axios"

const MEDIA_API = `${import.meta.env.VITE_BACKEND_UPI}/picVidGif/v1/media`

export const getImages = async (query) => {
    try {
        const response = await axios.get(`${MEDIA_API}/images/search`, {
            params: { query, page: 1, per_page: 20 },
            withCredentials: true
        })
        return response.data.data
    } catch (error) {
        console.log("Error while fetching images", error.response?.data || error.message)
        throw error
    }
}

export const getRandomImages = async () => {
    try {
        const response = await axios.get(`${MEDIA_API}/images/random`, {
            params: { count: 20 },
            withCredentials: true
        })
        return response.data.data
    } catch (error) {
        console.log("Error while fetching images", error.response?.data || error.message)
        throw error
    }
}
