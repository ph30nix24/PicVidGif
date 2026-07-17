import axios from "axios"

export const getImages = async (query) => {
    try {
        console.log("1")
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: { query, page: 1, per_page: 20 },
            headers: { Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}` }
        })
        return response.data
    } catch (error) {
        console.log("Error while fetching images", error.message)
        throw error
    }
}

export const getRandomImages = async () => {
    try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
            params: { count: 20 },
            headers: { Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}` }
        })
        return response.data
    } catch (error) {
        console.log("Error while fetching images", error.message)
        throw error
    }
}