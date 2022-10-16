import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL

export default class API {
    static registerEndpoint = baseUrl + '/'
    static loginEndpoint = baseUrl + '/login/'
    static logoutEndpoint = baseUrl + '/logout/'
    static activateEndpoint = baseUrl + '/confirm/'
    static countriesEndpoint = baseUrl + '/geo-api/countries/'
    static citiesEndpoint = baseUrl + '/geo-api/cities/?country='
    static getUserDetailsEndpoint = baseUrl + '/peoples/me/'

    static register(data, config) {
        return axios.post(this.registerEndpoint, data, config)
    }

    static login(data, config) {
        return axios.post(this.loginEndpoint, data, config)
    }

    static logout(config) {
        return axios.post(this.logoutEndpoint, {}, config)
    }

    static activate(uid, token, config) {
        return axios.get(`${this.activateEndpoint}${uid}/${token}`, config)
    }

    static getCountries(config) {
        return axios.get(this.countriesEndpoint, config)
    }

    static getCities(country_id, config) {
        return axios.get(`${this.citiesEndpoint}${country_id}`, config)
    }

    static getUserDetails(config) {
        return axios.get(this.getUserDetailsEndpoint, config)
    }
}