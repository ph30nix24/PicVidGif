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

export const addInCollection = async ({ sourceId, type, url, thumbnailUrl, description }) => {
    try {
        const response = await axios.post(`${COLLECTION_API}/`, { sourceId, type, url, thumbnailUrl, description }, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        console.error("Error removing from collection:", error.response?.data || error.message)
        throw error
    }
}

export const removeFromCollection = async (sourceId) => {
    try {
        const response = await axios.delete(`${COLLECTION_API}/${sourceId}`, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        console.error("Error removing from collection:", error.response?.data || error.message)
        throw error
    }
}
