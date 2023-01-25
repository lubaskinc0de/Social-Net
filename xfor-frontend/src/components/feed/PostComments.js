import React from 'react';

import List from '@mui/material/List';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import PostComment from './PostComment';

import { getTimeInfo } from '../../lib/feed';
import { useSelector } from 'react-redux';

export default function PostComments() {
    const { postComments } = useSelector((state) => state.comments);

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            maxWidth='xl'
        >
            <Paper
                sx={{
                    width: '100%',
                    maxWidth: 500,
                    p: 1,
                }}
            >
                <List
                    sx={{
                        width: '100%',
                    }}
                    className='comments'
                >
                    {postComments
                        ? postComments.map((el) => {
                              const getGeneralCommentProps = (comment) => {
                                  return {
                                      id: comment.id,
                                      username: `${comment.author.first_name} ${comment.author.last_name}`,
                                      text: comment.body,
                                      timesince: getTimeInfo(
                                          comment.created_at
                                      ).join(' в '),
                                      likesCount: comment.like_cnt,
                                      avatarAlt: comment.author.first_name,
                                      avatarSrc: comment.author.avatar,
                                      isLiked: comment.is_user_liked_comment,
                                  };
                              };

                              return (
                                  <li key={el.id}>
                                      <PostComment
                                          {...getGeneralCommentProps(el)}
                                      ></PostComment>
                                      {el.replies.length ? (
                                          <Box sx={{ pl: 7 }}>
                                              {el.replies.map((reply) => (
                                                  <PostComment
                                                      key={reply.id}
                                                      {...getGeneralCommentProps(
                                                          reply
                                                      )}
                                                  ></PostComment>
                                              ))}
                                          </Box>
                                      ) : null}
                                  </li>
                              );
                          })
                        : null}
                </List>
            </Paper>
        </Container>
    );
}
