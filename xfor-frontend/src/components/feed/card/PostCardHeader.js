import React from 'react';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';

export default function PostCardHeader(props) {
    const getAvatar = () => {
        if (props.loading) {
            return (
                <Skeleton
                    animation='wave'
                    variant='circular'
                    width={40}
                    height={40}
                />
            );
        }
        return (
            <Avatar
                loading='lazy'
                alt={props.avatarAlt}
                src={props.avatarSrc}
            ></Avatar>
        );
    };
    return (
        <CardHeader
            avatar={getAvatar()}
            action={
                <IconButton aria-label='settings'>
                    <MoreVertIcon />
                </IconButton>
            }
            title={
                props.loading ? (
                    <Skeleton
                        animation='wave'
                        height={10}
                        width='80%'
                        style={{ marginBottom: 6 }}
                    />
                ) : (
                    props.title
                )
            }
            subheader={
                props.loading ? (
                    <Skeleton animation='wave' height={10} width='40%' />
                ) : (
                    props.subheader
                )
            }
        />
    );
}
