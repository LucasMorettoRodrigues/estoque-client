import axios from 'axios'
import { getUser } from './auth.service';

export const api = axios.create({
    baseURL: process.env.BASEURL
})

api.interceptors.request.use(async config => {
    const loggedUser = getUser()

    if (loggedUser) {
        config.headers!.Authorization = `Bearer ${loggedUser.token}`
    }

    return config
})