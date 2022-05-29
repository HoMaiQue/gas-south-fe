import axios from "axios";
import queryString from 'query-string';

const axiosClient = axios.create({
    baseURL: "http://localhost:1338",
    headers: {
        "content-type": "application/json",
    },
    paramsSerializer: (params) => queryString.stringify(params, {sort: false}),
});
axiosClient.interceptors.request.use(async (config) => {
    return config;
});
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        // Handle errors
        throw error;
    }
);
export default axiosClient;
