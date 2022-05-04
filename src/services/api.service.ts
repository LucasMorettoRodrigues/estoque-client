import axios from 'axios'
import { getUser } from './auth.service';

export const api = axios.create({
    // baseURL: 'https://app-estoque-826.herokuapp.com/api/v1';
    baseURL: "http://localhost:5000/api/v1"
})

api.interceptors.request.use(async config => {
    const loggedUser = getUser()

    if (loggedUser) {
        config.headers!.Authorization = `Bearer ${loggedUser.token}`
    }

    return config
})