import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL

export default class API {
    static registerEndpoint = baseUrl + '/'
    static countriesEndpoint = baseUrl + '/geo-api/countries/'
    static citiesEndpoint = baseUrl + '/geo-api/cities/?country='

    static register(data, config) {
        return axios.post(this.registerEndpoint, data, config)
    }

    static getCountries(config) {
        return axios.get(this.countriesEndpoint, config)
    }

    static getCities(country_id, config) {
        return axios.get(`${this.citiesEndpoint}${country_id}`, config)
    }
}