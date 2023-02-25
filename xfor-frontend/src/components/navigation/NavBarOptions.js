import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import NavBarIcon from './NavBarIcon';
import NavBarMenu from './NavBarMenu';
import NavBarUserIcon from './NavBarUserIcon';
import NavBarSettingsToggler from './NavBarSettingsToggler';

import { useSelector } from 'react-redux';
import useSelectedTheme from '../../hooks/useSelectedTheme';

export default function NavBarOptions(props) {
    const pages = props.pages;

    const { first_name, avatar } = useSelector((state) => state.user.userInfo);
    const { loading } = useSelector((state) => state.user);

    const theme = useSelectedTheme();

    const iconProps = {
        title: 'KWIK',
        iconColor: theme !== 'dark' ? 'black' : 'original',
    };

    const navBarMenuProps = {
        pages: pages,
    };

    return (
        <Toolbar disableGutters>
            <NavBarIcon {...iconProps} isMobile={false}></NavBarIcon>
            <NavBarMenu {...navBarMenuProps} isMobile={true}></NavBarMenu>
            <NavBarIcon {...iconProps} isMobile={true}></NavBarIcon>
            <NavBarMenu {...navBarMenuProps} isMobile={false}></NavBarMenu>
            <NavBarSettingsToggler></NavBarSettingsToggler>
            <NavBarUserIcon
                loading={loading}
                src={avatar}
                alt={first_name}
            ></NavBarUserIcon>
        </Toolbar>
    );
}
