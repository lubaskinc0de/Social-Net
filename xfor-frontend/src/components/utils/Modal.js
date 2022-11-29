import MUIModal from '@mui/material/Modal';
import React from 'react';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Container from '@mui/material/Container';

export default function Modal(props) {
    const boxStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        p: 4,
        maxWidth: 1000,
        minWidth: 310,
        outline: 'none',
        borderRadius: '0.5rem',
        WebkitBoxShadow: '0 3px 7px rgba(0, 0, 0, 0.3)',
        MozBoxShadow: '0 3px 7px rgba(0, 0, 0, 0.3)',
        boxShadow: '0 3px 7px rgba(0, 0, 0, 0.3)',
        ...props.sx,
    };

    return (
        <MUIModal
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            open={props.open}
            onClose={props.handleClose}
        >
            <Fade in={props.open}>
                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    component='main'
                    maxWidth='xl'
                >
                    <Box sx={boxStyle}>{props.children}</Box>
                </Container>
            </Fade>
        </MUIModal>
    );
}
