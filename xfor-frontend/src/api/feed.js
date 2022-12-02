import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

export default class API {
    static postsEndpoint = baseUrl + '/feed/';
    static postLikeEndpoint = baseUrl + '/api/add-like/';

    static getPosts(urlParameters, config) {
        return axios.get(`${this.postsEndpoint}?${urlParameters}`, config);
    }

    static postLike(data, config) {
        return axios.put(this.postLikeEndpoint, data, config);
    }

    static getPost(postId, config) {
        return axios.get(`${this.postsEndpoint}${postId}/`, config)
    }
}
