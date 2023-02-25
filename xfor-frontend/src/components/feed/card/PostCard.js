import React from 'react';

import Card from '@mui/material/Card';
import CardContent from './PostCardContent';
import CardActions from './PostCardActions';
import CardMedia from './PostCardMedia';
import CardHeader from './PostCardHeader';
import { useDispatch, useSelector } from 'react-redux';
import { postLike } from '../../../store/actions/postsActions';
import PostCardSkeleton from './PostCardSkeleton';

export default function PostCard(props) {
    const dispatch = useDispatch();
    const { likePendingPosts } = useSelector((state) => state.posts);

    const handleLikeClick = () => {
        dispatch(postLike(props.id));
    };

    const postUrl = `/feed/${props.id}`;

    return (
        <Card sx={{ maxWidth: props.maxWidth || 345, width: '100%' }}>
            {props.loading ? (
                <PostCardSkeleton></PostCardSkeleton>
            ) : (
                <>
                    <CardHeader
                        avatarAlt={props.avatarAlt}
                        avatarSrc={props.avatarSrc}
                        title={props.title}
                        href={postUrl}
                        subheader={props.subheader}
                    ></CardHeader>
                    <CardMedia images={props.images}></CardMedia>
                    <CardContent content={props.content}></CardContent>
                    <CardActions
                        handleLikeClick={handleLikeClick}
                        timesince={props.timesince}
                        time={props.time}
                        likeDisabled={likePendingPosts.hasOwnProperty(props.id)}
                        likesCount={props.likesCount}
                        commentsCount={props.commentsCount}
                        commentsHref={postUrl}
                        isLiked={props.isLiked}
                        viewsCount={props.viewsCount}
                    ></CardActions>
                </>
            )}
        </Card>
    );
}
