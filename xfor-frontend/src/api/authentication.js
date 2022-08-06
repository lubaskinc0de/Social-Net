import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000'

export default class API {
    static registerEndpoint = baseUrl + '/'

    static register(data, config) {
        return axios.post(this.registerEndpoint, data, config)
    }
}