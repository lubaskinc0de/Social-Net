import React from 'react';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';
import KwikIcon from '../icons/KwikIcon';

export default function NavBarIcon(props) {
    const getDisplay = () => {
        if (props.isMobile) {
            return {xs: 'flex', md: 'none'};
        }
        return {xs: 'none', md: 'flex'};
    };
    return (
        <>
            <SvgIcon
                fontSize='large'
                sx={{
                    mr: 1,
                    display: getDisplay(),
                }}>
                <KwikIcon color={props.iconColor}></KwikIcon>
            </SvgIcon>
            <Typography
                variant='h6'
                noWrap
                component='a'
                href='/feed/'
                sx={{
                    mr: 2,
                    display: getDisplay(),
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                    flexGrow: props.isMobile ? 1 : undefined,
                }}>
                {props.title}
            </Typography>
        </>
    );
}
