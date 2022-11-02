import {createSlice} from '@reduxjs/toolkit';
import {
    userRegister,
    userLogin,
    userLogout,
    userActivate,
    getUserDetails,
    getCountries,
    getCities,
} from '../../actions/userActions';
import {getToken, setToken, removeToken} from '../../../lib/authentication';

const userToken = getToken();
const initialState = {
    userInfo: {
        profile_id: null,
        first_name: null,
        last_name: null,
        avatar: null,
    },
    token: userToken,
    loading: null,
    success: null,
    errors: [],
    countries: [],
    cities: [],
    rejected: null,
};

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        clearSuccess(state) {
            state.success = initialState.success;
        },
        clearCities(state) {
            state.cities = [];
        },
        clearGeo(state) {
            state.cities = [];
            state.countries = [];
        },
    },
    extraReducers: {
        // userRegister
        [userRegister.pending](state) {
            state.success = false;
            state.loading = true;
        },

        [userRegister.fulfilled](state) {
            state.success = true;
            state.loading = false;
        },

        [userRegister.rejected](state) {
            state.loading = false;
        },

        // userLogin

        [userLogin.pending](state) {
            state.success = false;
            state.loading = true;
        },

        [userLogin.fulfilled](state, action) {
            state.success = true;
            state.loading = false;
            state.token = action.payload.token;
            state.userInfo = action.payload.userInfo;
            setToken(action.payload.token);
        },

        [userLogin.rejected](state) {
            state.loading = false;
        },

        // userLogout

        [userLogout.pending](state) {
            state.loading = true;
        },

        [userLogout.fulfilled](state) {
            state.loading = false;

            removeToken();

            state.userInfo = initialState.userInfo;
            state.token = null;
        },

        [userLogout.rejected](state) {
            state.loading = false;
        },

        // userActivate

        [userActivate.pending](state) {
            state.success = false;
            state.loading = true;
        },

        [userActivate.fulfilled](state) {
            state.loading = false;
            state.success = true;
        },

        [userActivate.rejected](state, action) {
            state.loading = false;
            state.rejected = true;
            state.errors = action.payload.APIErrors;
        },

        // getUserDetails
        [getUserDetails.pending](state) {
            state.loading = true;
        },

        [getUserDetails.fulfilled](state, action) {
            state.userInfo = action.payload;
            state.loading = false;
        },

        [getUserDetails.rejected](state, action) {
            const errorCode = action.payload.status_code;
            state.loading = false;

            if (errorCode === 401 && state.token) {
                removeToken();
                state.token = null;
            }
        },

        // getCountries
        [getCountries.pending](state) {
            state.loading = true;
        },

        [getCountries.fulfilled](state, action) {
            state.loading = false;
            state.countries = action.payload.countries;
        },

        [getCountries.rejected](state) {
            state.loading = false;
        },

        // getCities
        [getCities.pending](state) {
            state.loading = true;
        },

        [getCities.fulfilled](state, action) {
            state.loading = false;

            const {cities} = action.payload;
            cities.sort((a, b) =>
                a.alternate_names.localeCompare(b.alternate_names),
            );

            state.cities = cities;
        },

        [getCities.rejected](state) {
            state.loading = false;
        },
    },
});

export const {clearSuccess, clearCities, clearGeo} = userSlice.actions;
export default userSlice.reducer;