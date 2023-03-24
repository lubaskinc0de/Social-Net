import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

/**
 * API for the peoples part
 */
export default class API {
    static getPeopleEndpoint = baseUrl + '/peoples/'

    /**
     * Get people
     * @param {Object} config
     * @param {Number} profileId
     */
    static getPeople(config, profileId) {
        return axios.get(`${this.getPeopleEndpoint}${profileId}/`, config)
    }
}
