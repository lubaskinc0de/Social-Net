import API from '../../api/peoples';
import PostsAPI from '../../api/feed';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { parseAPIAxiosErrors } from '../../lib';
import { getAge } from '../../lib/peoples';
import { setAPIErrors } from '../slices/APIErrorsSlice';

export const getPeople = createAsyncThunk(
    'user/getPeople',
    async (profileId, { dispatch, rejectWithValue, getState }) => {
        try {
            const { user } = getState();

            const config = {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            };

            const response = await API.getPeople(config, profileId);

            const { first_name, last_name, id: userId } = response.data.user;
            const {
                avatar,
                bio,
                city: { alternate_names: city },
                followers_count: followersCount,
                birthday,
                date_joined,
            } = response.data;

            const dateJoined = date_joined.split('T')[0]; // bad hardcoding
            const age = getAge(birthday);

            return {
                first_name,
                last_name,
                avatar,
                bio,
                city,
                followersCount,
                age,
                dateJoined,
                userId,
            };
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err);

            dispatch(
                setAPIErrors({
                    APIErrors,
                })
            );

            return rejectWithValue();
        }
    }
);

export const getPeoplePosts = createAsyncThunk(
    'user/getPeoplePosts',
    async (_, { rejectWithValue, dispatch, getState }) => {
        try {
            const { user, peoples } = getState();

            const config = {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            };

            const userId = peoples.peopleInfo.userId;

            if (!userId) {
                return rejectWithValue()
            }

            const urlParameters = `author=${userId}`;

            const response = await PostsAPI.getPosts(urlParameters, config);
            const posts = response.data.results;

            return {
                posts,
            };
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err);

            dispatch(
                setAPIErrors({
                    APIErrors,
                })
            );

            return rejectWithValue();
        }
    }
);