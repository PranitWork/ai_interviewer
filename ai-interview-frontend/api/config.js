import axios from "axios";

const BASE_URL = import.meta.env.BASE_URL;
console.log(BASE_URL);


const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

export default instance;