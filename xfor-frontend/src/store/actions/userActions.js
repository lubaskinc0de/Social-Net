import {createAsyncThunk} from '@reduxjs/toolkit';
import API from '../../api/authentication';
import {parseAPIAxiosErrors} from '../../lib';
import {setAPIErrors} from '../slices/authentication/APIErrorsSlice';

export const userRegister = createAsyncThunk(
    'user/register',
    async (userData, {dispatch, rejectWithValue}) => {
        try {
            await API.register(userData);
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err);

            dispatch(
                setAPIErrors({
                    APIErrors,
                }),
            );

            return rejectWithValue({
                APIErrors,
            });
        }
    }
)

export const userLogin = createAsyncThunk(
    'user/login',
    async ({username, password}, {dispatch, rejectWithValue}) => {
        try {
            const response = await API.login({username, password});
            return {
                token: response.data.token,
                userInfo: response.data.user,
            };
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err);

            dispatch(
                setAPIErrors({
                    APIErrors,
                }),
            );

            return rejectWithValue({
                APIErrors,
            });
        }
    },
);

export const userLogout = createAsyncThunk(
    'user/logout',
    async (_, {dispatch, rejectWithValue, getState}) => {
        try {
            const {user} = getState();

            const config = {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            };

            await API.logout(config)
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err);

            dispatch(
                setAPIErrors({
                    APIErrors,
                }),
            );

            return rejectWithValue({
                APIErrors,
            });
        }
    },
);

export const userActivate = createAsyncThunk(
    'user/activate',
    async (data, {rejectWithValue}) => {
        try {
            const {uid, token} = data
            await API.activate(uid, token);
        } catch (err) {
            const APIErrors = parseAPIAxiosErrors(err)

            return rejectWithValue({
                APIErrors,
            });
        }
    }
)

export const getUserDetails = createAsyncThunk(
    'user/getUserDetails',
    async (_, {dispatch, rejectWithValue, getState}) => {
        try {
            const {user} = getState();

            const config = {
                headers: {
                    Authorization: `Token ${user.token}`,
                },
            };

            const response = await API.getUserDetails(config);

            const {first_name, last_name} = response.data.user;
            const {avatar, id} = response.data;

            return {
                profile_id: id,
                first_name,
                last_name,
                avatar,
            };
        } catch (err) {
            const APIErrors = [
                'Не удалось получить данные о вас, скорее всего сервер недоступен или ваша сессия истекла. Повторите попытку позже!',
            ];

            dispatch(
                setAPIErrors({
                    APIErrors,
                }),
            );

            return rejectWithValue({
                status_code: err.response.status,
            });
        }
    },
);
