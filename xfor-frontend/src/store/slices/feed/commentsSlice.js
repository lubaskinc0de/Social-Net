import { createSlice } from '@reduxjs/toolkit';
import { commentLike, getComments } from '../../actions/commentsActions';

import { findComment } from '../../../lib/feed';

const commentsSlice = createSlice({
    name: 'commentsSlice',
    initialState: {
        likePendingComments: {},
        postComments: [],
    },
    extraReducers: {
        // commentsLike
        [commentLike.pending](state, action) {
            const { arg: commentId } = action.meta;
            state.likePendingComments[commentId] = null;
        },

        [commentLike.fulfilled](state, action) {
            const { action: actionType, commentId } = action.payload;

            const comment = findComment(state.postComments, commentId);

            const isAdd = actionType === 'add';

            delete state.likePendingComments[commentId];

            comment.is_user_liked_comment = isAdd;
            comment.like_cnt += isAdd ? 1 : -1;
        },

        [commentLike.rejected](state, action) {
            const { id: commentId } = action.payload;
            delete state.likePendingComments[commentId];
        },

        // getComments
        [getComments.fulfilled](state, action) {
            const { comments } = action.payload;

            state.postComments = comments;
        },
    },
});

export default commentsSlice.reducer;
