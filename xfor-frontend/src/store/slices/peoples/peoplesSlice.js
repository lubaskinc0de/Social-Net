import { createSlice } from '@reduxjs/toolkit';

import { getPeople, getPeoplePosts } from '../../actions/peoplesActions';

const initialState = {
    peopleInfo: {
        first_name: null,
        last_name: null,
        avatar: null,
        bio: null,
        city: null,
        followersCount: null,
        age: null,
        dateJoined: null,
        userId: null,
    },
    loading: null,
    posts: [],
    postsLoading: null,
};

const peoplesSlice = createSlice({
    name: 'userSlice',
    initialState,
    extraReducers: {
        // getPeople
        [getPeople.pending](state) {
            state.peopleInfo = initialState.peopleInfo;
            state.loading = true;
            state.posts = [];
            state.postsLoading = null;
        },

        [getPeople.fulfilled](state, action) {
            state.peopleInfo = action.payload;
            state.loading = false;
        },

        [getPeople.rejected](state) {
            state.loading = false;
        },

        // getPeoplePosts
        [getPeoplePosts.pending](state) {
            state.postsLoading = true;
        },

        [getPeoplePosts.fulfilled](state, action) {
            state.posts = action.payload.posts;
            state.postsLoading = false;
        },

        [getPeoplePosts.rejected](state) {
            state.postsLoading = false;
        }
    },
});

export default peoplesSlice.reducer;
