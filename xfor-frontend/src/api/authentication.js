import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

/**
 * API for the authentication part
 */
export default class API {
    static registerEndpoint = baseUrl + '/';
    static loginEndpoint = baseUrl + '/login/';
    static logoutEndpoint = baseUrl + '/logout/';
    static activateEndpoint = baseUrl + '/confirm/';
    static countriesEndpoint = baseUrl + '/geo-api/countries/';
    static citiesEndpoint = baseUrl + '/geo-api/cities/?country=';
    static getUserDetailsEndpoint = baseUrl + '/peoples/me/';
    static getUserProfileEndpoint = baseUrl + '/peoples/'
    static checkTokenEndpoint = baseUrl + '/check-token/';

    /**
     * Register user
     * @param {Object} data
     * @param {Object} config
     * @returns {Promise<import('axios').AxiosResponse}
     */
    static register(data, config) {
        return axios.post(this.registerEndpoint, data, config);
    }

    /**
     * Login user
     * @param {Object} data
     * @param {Object} config
     * @returns {Promise<import('axios').AxiosResponse}
     */
    static login(data, config) {
        return axios.post(this.loginEndpoint, data, config);
    }

    /**
     * Logout user
     * @param {Object} config
     * @returns {Promise<import('axios').AxiosResponse}
     */
    static logout(config) {
        return axios.post(this.logoutEndpoint, {}, config);
    }

    /**
     * Activate user account
     * @param {String} uid
     * @param {String} token
     * @param {Object} config
     * @returns {Promise<import('axios').AxiosResponse}
     */
    static activate(uid, token, config) {
        return axios.get(`${this.activateEndpoint}${uid}/${token}`, config);
    }

    /**
     * Get countries
     * @param {Object} config
     * @returns {Promise<import('axios').AxiosResponse}
     */
    static getCountries(config) {
        return axios.get(this.countriesEndpoint, config);
    }

    /**
     * Get cities
     * @param {Number} country_id
     * @param {Object} config
     * @returns {Promise<import('axios').AxiosResponse}
     */
    static getCities(country_id, config) {
        return axios.get(`${this.citiesEndpoint}${country_id}`, config);
    }

    /**
     * Get user details
     * @param {Object} config
     * @returns
     */
    static getUserDetails(config) {
        return axios.get(this.getUserDetailsEndpoint, config);
    }

    /**
     * Get user profile
     * @param {Object} config
     * @param {Number} profileId
     */
    static getUserProfile(config, profileId) {
        return axios.get(`${this.getUserProfileEndpoint}${profileId}/`)
    }

    /**
     * Check user token
     * @param {Object} config
     * @returns {Promise<import('axios').AxiosResponse}
     */
    static checkToken(config) {
        return axios.get(this.checkTokenEndpoint, config);
    }
}
