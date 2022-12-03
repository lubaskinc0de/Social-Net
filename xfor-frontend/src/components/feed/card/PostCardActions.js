import React from 'react';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Like from './PostCardLike';
import CommentsCount from './PostCardCommentsCount';
import Views from './PostCardViews';
import Divider from '@mui/material/Divider';

export default function PostCardActions(props) {
    const timeParts = props.time.split(':');
    const zeroFilledMinutes = timeParts[1].padStart(2, '0');
    const time = `${timeParts[0]}:${zeroFilledMinutes}`;

    return (
        <>
            <Divider variant='middle'></Divider>
            <CardActions
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div className='flex-align__box'>
                    <Like
                        disabled={props.likeDisabled}
                        handleLikeClick={props.handleLikeClick}
                        isLiked={props.isLiked}
                        likesCount={props.likesCount}
                    ></Like>
                    <CommentsCount
                        href={props.commentsHref}
                        commentsCount={props.commentsCount}
                    ></CommentsCount>
                </div>
                <div className='flex-align__box'>
                    <Typography
                        color='rgba(255, 255, 255, 0.7)'
                        variant='body2'
                    >
                        {props.timesince} в {time}
                    </Typography>
                </div>
                <Views viewsCount={props.viewsCount}></Views>
            </CardActions>
        </>
    );
}
