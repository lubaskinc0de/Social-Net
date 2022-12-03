import { removeToken } from './slices/authentication/userSlice';
import { clearRejected } from './slices/feed/postsSlice';
import { debounce } from '../lib';

import API from '../api/authentication';

export const checkToken = debounce((token, dispatch) => {
    const config = {
        headers: {
            Authorization: `Token ${token}`,
        },
    };

    API.checkToken(config).catch((error) => {
        if (error.response.status === 401) {
            dispatch(removeToken());
            dispatch(clearRejected());
        }
    });
}, 1000);
