import axios from 'axios'

const COLLECTION_API = `${import.meta.env.VITE_BACKEND_UPI}/picVidGif/v1/collection`

export const getSavedImages = async () => {
    try {
        const response = await axios.get(`${COLLECTION_API}/`, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        console.error("Error fetching saved images:", error.response?.data || error.message)
        throw error
    }
}

export const removeFromCollection = async (imageId) => {
    try {
        const response = await axios.delete(`${COLLECTION_API}/${imageId}`, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        console.error("Error removing from collection:", error.response?.data || error.message)
        throw error
    }
}
