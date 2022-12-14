import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

/**
 * API for the feed part
 */
export default class API {
    static postsEndpoint = baseUrl + '/feed/';
    static postLikeEndpoint = baseUrl + '/api/add-like/';

    /**
     * Get posts with GET-params
     * @param {String} urlParameters
     * @param {Object} config
     * @returns {Promise<import('axios').AxiosResponse}
     */
    static getPosts(urlParameters, config) {
        return axios.get(`${this.postsEndpoint}?${urlParameters}`, config);
    }

    /**
     * Like the post
     * @param {Object} data
     * @param {Object} config
     * @returns {Promise<import('axios').AxiosResponse}
     */
    static postLike(data, config) {
        return axios.put(this.postLikeEndpoint, data, config);
    }

    /**
     * Get post
     * @param {Number} postId
     * @param {Object} config
     * @returns {Promise<import('axios').AxiosResponse}
     */
    static getPost(postId, config) {
        return axios.get(`${this.postsEndpoint}${postId}/`, config);
    }
}
