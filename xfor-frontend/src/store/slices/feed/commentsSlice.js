import { createSlice } from '@reduxjs/toolkit';
import {
    commentLike,
    getComments,
    getCommentDescendants,
} from '../../actions/commentsActions';

import { findComment, parsePageFromNextPage } from '../../../lib/feed';

const commentsSlice = createSlice({
    name: 'commentsSlice',
    initialState: {
        likePendingComments: {},
        postComments: [],
        nextPage: 1,
        commentsLoading: null,
        descendantsPage: {},
        descendantsLoading: {},
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
        [getComments.pending](state) {
            state.commentsLoading = true;
        },

        [getComments.fulfilled](state, action) {
            const { comments, nextPage } = action.payload;

            const page = parsePageFromNextPage(nextPage);

            if (comments.length) {
                state.postComments = state.postComments.concat(comments);
            }

            state.nextPage = page;
            state.commentsLoading = false;
        },

        [getComments.rejected](state) {
            state.commentsLoading = false;
        },

        [getCommentDescendants.pending](state, action) {
            const { arg: commentId } = action.meta;

            if (!state.descendantsPage.hasOwnProperty(commentId)) {
                state.descendantsPage[commentId] = 1;
            }

            state.descendantsLoading[commentId] = true;
        },

        [getCommentDescendants.fulfilled](state, action) {
            const { descendants, commentId, nextPage } = action.payload;

            const page = parsePageFromNextPage(nextPage);

            console.log('page in reducer: ', page);

            const comment = findComment(state.postComments, commentId);

            if (descendants.length) {
                if (comment.replies.length <= 2) {
                    comment.replies = descendants;
                } else {
                    comment.replies = comment.replies.concat(descendants);
                }
            }

            state.descendantsPage[commentId] = page;

            console.log('descendants page: ', state.descendantsPage[commentId]);

            delete state.descendantsLoading[commentId];
        },

        [getCommentDescendants.rejected](state, action) {
            const { commentId } = action.payload;

            delete state.descendantsLoading[commentId];
        },
    },
});

export default commentsSlice.reducer;
