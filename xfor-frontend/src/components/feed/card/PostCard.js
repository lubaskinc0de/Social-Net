import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from './PostCardActions';
import Typography from '@mui/material/Typography';
import CardMedia from './PostCardMedia';
import CardHeader from './PostCardHeader';
import {useDispatch, useSelector} from 'react-redux';
import {postLike} from '../../../store/actions/postsActions';
import PostCardSkeleton from './PostCardSkeleton';

export default function PostCard(props) {
    const dispatch = useDispatch();
    const {likePendingPosts} = useSelector((state) => state.posts);

    const handleLikeClick = (e) => {
        dispatch(postLike(props.id));
    };

    return (
        <Card sx={{maxWidth: 345, width: '100%'}}>
            {props.loading ? (
                <PostCardSkeleton></PostCardSkeleton>
            ) : (
                <>
                    <CardHeader
                        avatarAlt={props.avatarAlt}
                        avatarSrc={props.avatarSrc}
                        title={props.title}
                        subheader={props.subheader}></CardHeader>
                    <CardMedia images={props.images}></CardMedia>
                    <CardContent>
                        <Typography variant='body2'>{props.content}</Typography>
                    </CardContent>
                    <CardActions
                        handleLikeClick={handleLikeClick}
                        timesince={props.timesince}
                        time={props.time}
                        likeDisabled={likePendingPosts.hasOwnProperty(props.id)}
                        likesCount={props.likesCount}
                        isLiked={props.isLiked}
                        viewsCount={props.viewsCount}></CardActions>
                </>
            )}
        </Card>
    );
}