import axios from "axios";

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

axiosSecure.interceptors.request.use((config) => {
    const token = localStorage.getItem("access-token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


axiosSecure.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        
        console.error("Unauthorized or Forbidden access - redirecting to login might be needed");
    }
    return Promise.reject(error);
});

export default axiosSecure;