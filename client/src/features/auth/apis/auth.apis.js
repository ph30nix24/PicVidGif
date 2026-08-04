import axios from 'axios'

const AUTH_UPI = `${import.meta.env.VITE_BACKEND_URI}/picVidGif/v1/auth`


export const loginApi = async ({ token }) => {
    try {
        const response = await axios.post(`${AUTH_UPI}/`, { token }, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        console.error("login failed:", error.response?.data || error.message);
        throw error;
    }
}

export const getUser = async () => {
    try {
        const response = await axios.get(`${AUTH_UPI}/`, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        console.error("login failed:", error.response?.data || error.message);
        throw error;
    }
}