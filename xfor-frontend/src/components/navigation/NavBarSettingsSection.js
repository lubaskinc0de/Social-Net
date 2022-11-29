import React from 'react';
import Typography from '@mui/material/Typography';

export default function NavBarSettingsSection({ title, children }) {
    return (
        <>
            <Typography
                sx={{
                    mt: 2.5,
                    mr: 0,
                    mb: 1.25,
                }}
                fontSize='0.6875rem'
                color='rgb(111, 126, 140)'
                textTransform='uppercase'
                fontWeight={700}
                letterSpacing='0.08rem'
                gutterBottom
                component='p'
                variant='body1'
            >
                {title}
            </Typography>
            {children}
        </>
    );
}
