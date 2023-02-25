import React from 'react';

import NavBar from '../navigation/NavBar';
import Errors from './Errors';

import Box from '@mui/material/Box';

export default function AppContainer({ children }) {
    return (
        <>
            <NavBar></NavBar>
            <Box sx={{ pt: 12 }}>
                <Box sx={{ mb: 2 }}>
                    <Errors></Errors>
                </Box>
                {children}
            </Box>
        </>
    );
}
