import { createSlice } from '@reduxjs/toolkit';

import {
    userRegister,
    userLogin,
    userLogout,
    userActivate,
    getUserDetails,
    getCountries,
    getCities,
} from '../../actions/userActions';

import {
    setToLocalStorage,
    getFromLocalStorage,
    removeFromLocalStorage,
} from '../../../lib';

const userToken = getFromLocalStorage('userToken');

const initialState = {
    userInfo: {
        profile_id: null,
        first_name: null,
        last_name: null,
        avatar: null,
        bio: null,
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
        /**
         * Set success state to the null
         * @param {Object} state
         */
        clearSuccess(state) {
            state.success = initialState.success;
        },

        /**
         * Set cities state to the []
         * @param {Object} state
         */
        clearCities(state) {
            state.cities = [];
        },

        /**
         * Set cities and countries states to the []
         * @param {Object} state
         */
        clearGeo(state) {
            state.cities = [];
            state.countries = [];
        },

        /**
         * Remove token from ls and set token state to the null
         * @param {Object} state
         */
        removeToken(state) {
            removeFromLocalStorage('userToken');
            state.token = null;
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
            state.loading = true;
        },

        [userLogin.fulfilled](state, action) {
            state.loading = false;
            state.token = action.payload.token;
            state.userInfo = action.payload.userInfo;
            setToLocalStorage('userToken', action.payload.token);
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

            removeFromLocalStorage('userToken');

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

        [getUserDetails.rejected](state) {
            state.loading = false;
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

            const { cities } = action.payload;
            cities.sort((a, b) =>
                a.alternate_names.localeCompare(b.alternate_names)
            );

            state.cities = cities;
        },

        [getCities.rejected](state) {
            state.loading = false;
        },
    },
});

export const { clearSuccess, clearCities, clearGeo, removeToken } =
    userSlice.actions;
export default userSlice.reducer;
