import axios from "axios";
import { getAuthToken } from "../cookie";

const BASE_URL = 'http://localhost:5001/';
const axiosInstance  = axios.create({
    baseURL : BASE_URL,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await getAuthToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        // Set Content-Type only for non-FormData requests
        // For FormData, axios will automatically set multipart/form-data with boundary
        if (!(config.data instanceof FormData)) {
            config.headers["Content-Type"] = "application/json";
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;