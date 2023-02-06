import React from 'react';

import List from '@mui/material/List';

import PostComment from './PostComment';
import PostCommentsSkeleton from './PostCommentsSkeleton';

import { getTimeInfo } from '../../../lib/feed';
import { useSelector } from 'react-redux';

export default function PostCommentsList() {
    const { postComments, commentsLoading } = useSelector(
        (state) => state.comments
    );

    return (
        <List
            sx={{
                width: '100%',
                mb: 0.5,
            }}
            className='comments'
        >
            {postComments
                ? postComments.map((el) => {
                      const getCommentProps = (comment) => {
                          return {
                              id: comment.id,
                              username: `${comment.author.first_name} ${comment.author.last_name}`,
                              text: comment.body,
                              timesince: getTimeInfo(comment.created_at).join(
                                  ' в '
                              ),
                              likesCount: comment.like_cnt,
                              avatarAlt: comment.author.first_name,
                              avatarSrc: comment.author.avatar,
                              isLiked: comment.is_user_liked_comment,
                              replies: comment.replies,
                              repliesCnt:
                                  comment.replies_cnt - comment.replies.length,
                          };
                      };

                      return (
                          <li key={el.id} className='comment'>
                              <PostComment
                                  {...getCommentProps(el)}
                              ></PostComment>
                          </li>
                      );
                  })
                : null}
            {commentsLoading ? (
                <PostCommentsSkeleton></PostCommentsSkeleton>
            ) : null}
        </List>
    );
}
