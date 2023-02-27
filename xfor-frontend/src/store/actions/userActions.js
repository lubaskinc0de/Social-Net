import API from '../../api/authentication';
import PostsAPI from '../../api/feed';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { parseAPIAxiosErrors } from '../../lib';
import { getAge } from '../../lib/peoples';
import { setAPIErrors, clearAPIErrors } from '../slices/APIErrorsSlice';

export const userRegister = createAsyncThunk(
    'user/register',
    async (userData, { dispatch, rejectWithValue }) => {
        try {
            await API.register(userData);
            dispatch(clearAPIErrors());
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err);

            dispatch(
                setAPIErrors({
                    APIErrors,
                })
            );

            return rejectWithValue({
                APIErrors,
            });
        }
    }
);

export const userLogin = createAsyncThunk(
    'user/login',
    async ({ username, password }, { dispatch, rejectWithValue }) => {
        try {
            const response = await API.login({ username, password });
            dispatch(clearAPIErrors());
            return {
                token: response.data.token,
                userInfo: response.data.user,
            };
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err);

            dispatch(
                setAPIErrors({
                    APIErrors,
                })
            );

            return rejectWithValue({
                APIErrors,
            });
        }
    }
);

export const userLogout = createAsyncThunk(
    'user/logout',
    async (_, { dispatch, rejectWithValue, getState }) => {
        try {
            const { user } = getState();

            const config = {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            };

            await API.logout(config);
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err);

            dispatch(
                setAPIErrors({
                    APIErrors,
                })
            );

            return rejectWithValue({
                APIErrors,
            });
        }
    }
);

export const userActivate = createAsyncThunk(
    'user/activate',
    async (data, { rejectWithValue }) => {
        try {
            const { uid, token } = data;
            await API.activate(uid, token);
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err);

            return rejectWithValue({
                APIErrors,
            });
        }
    }
);

export const getUserDetails = createAsyncThunk(
    'user/getUserDetails',
    async (_, { dispatch, rejectWithValue, getState }) => {
        try {
            const { user } = getState();

            const config = {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            };

            const response = await API.getUserDetails(config);

            const { first_name, last_name, id: userId } = response.data.user;
            const {
                avatar,
                bio,
                id,
                city: { alternate_names: city },
                followers_count: followersCount,
                birthday,
                date_joined,
            } = response.data;

            const dateJoined = date_joined.split('T')[0]; // bad hardcoding
            const age = getAge(birthday);

            return {
                userId,
                profile_id: id,
                first_name,
                last_name,
                avatar,
                bio,
                city,
                followersCount,
                age,
                dateJoined,
            };
        } catch (err) {
            const APIErrors = [
                'Не удалось получить данные о вас, скорее всего сервер недоступен или ваша сессия истекла. Повторите попытку позже!',
            ];

            dispatch(
                setAPIErrors({
                    APIErrors,
                })
            );

            return rejectWithValue();
        }
    }
);

export const getCountries = createAsyncThunk(
    'user/getCountries',
    async (_, { dispatch, rejectWithValue, getState }) => {
        try {
            const response = await API.getCountries();
            const countries = response.data;

            return {
                countries,
            };
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err);

            dispatch(
                setAPIErrors({
                    APIErrors,
                })
            );

            return rejectWithValue({
                APIErrors,
            });
        }
    }
);

export const getCities = createAsyncThunk(
    'user/getCities',
    async (country_id, { dispatch, rejectWithValue, getState }) => {
        try {
            const response = await API.getCities(country_id);
            const cities = response.data;

            return {
                cities,
            };
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err);

            dispatch(
                setAPIErrors({
                    APIErrors,
                })
            );

            return rejectWithValue({
                APIErrors,
            });
        }
    }
);

export const getUserPosts = createAsyncThunk(
    'user/getUserPosts',
    async (_, { rejectWithValue, dispatch, getState }) => {
        try {
            const { user } = getState();

            const config = {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            };

            const urlParameters = `author=${user.userInfo.userId}`;

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
