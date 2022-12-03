import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';

export default function NavBarMenu(props) {
    const [anchorElNav, setAnchorElNav] = useState(null);

    const getPages = () => {
        return props.pages.map((page) => {
            if (props.isMobile) {
                return (
                    <MenuItem
                        href={page.href}
                        key={page.title}
                        onClick={() => {
                            handleCloseNavMenu();
                            if (page.handleClick) {
                                page.handleClick();
                            }
                        }}
                    >
                        <Typography textAlign='center'>{page.title}</Typography>
                    </MenuItem>
                );
            }

            return (
                <Button
                    key={page.title}
                    href={page.href}
                    sx={{
                        my: 2,
                        color: 'white',
                        display: 'block',
                    }}
                >
                    {page.title}
                </Button>
            );
        });
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const getMenu = () => {
        if (props.isMobile) {
            return (
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        onClick={handleOpenNavMenu}
                        size='large'
                        aria-haspopup='true'
                        color='inherit'
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        anchorEl={anchorElNav}
                        open={!!anchorElNav}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                        }}
                    >
                        {getPages()}
                    </Menu>
                </Box>
            );
        }

        return (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {getPages()}
            </Box>
        );
    };

    return getMenu();
}
