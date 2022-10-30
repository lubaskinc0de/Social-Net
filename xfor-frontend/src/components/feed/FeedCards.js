import React from 'react';
import Grid from '@mui/material/Grid';
import PostCard from './card/PostCard';
import {getTimeInfo} from '../../lib/feed';
import {useSelector} from 'react-redux';
import FeedSkeleton from './FeedSkeleton';

export default function FeedCards(props) {
    const {posts, loading} = useSelector((state) => state.posts);

    return loading && !posts.length ? (
        <FeedSkeleton></FeedSkeleton>
    ) : (
        <>
            {posts.map((el) => {
                const [timesince, time] = getTimeInfo(el.created_at);

                return (
                    <Grid
                        item
                        key={el.id}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                        }}>
                        <PostCard
                            id={el.id}
                            content={el.content}
                            avatarAlt={el.author.first_name}
                            avatarSrc={el.author.avatar}
                            title={el.title}
                            subheader={`${el.author.first_name} ${el.author.last_name}`}
                            timesince={timesince}
                            time={time}
                            viewsCount={el.viewers_count}
                            likesCount={el.liked_count}
                            isLiked={el.is_user_liked_post}
                            images={el.images}></PostCard>
                    </Grid>
                );
            })}
            {loading ? <FeedSkeleton /> : null}
        </>
    );
}
