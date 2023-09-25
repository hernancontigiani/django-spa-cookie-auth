import axios from 'axios'

const baseURL = "http://localhost:8180"
//const baseURL = "http://cursos.inovecode.com"

export const client = axios.create({
    baseURL: baseURL,
    withCredentials: true  // Equivalent to credentials: "include"
});


