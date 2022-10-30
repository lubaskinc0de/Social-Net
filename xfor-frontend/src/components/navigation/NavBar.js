import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import NavBarOptions from './NavBarOptions';

export default function NavBar(props) {
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position='fixed'>
                <Container maxWidth='xl'>
                    <NavBarOptions pages={props.pages}></NavBarOptions>
                </Container>
            </AppBar>
        </Box>
    );
}
