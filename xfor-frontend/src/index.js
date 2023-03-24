import Register from './components/authentication/register/Register';
import Login from './components/authentication/login/Login';
import Logout from './components/authentication/logout/Logout';
import Activation from './components/authentication/activation/Activation';

import Feed from './components/feed/Feed';
import PostPage from './components/feed/post/PostPage';

import MyProfile from './components/peoples/MyProfile';
import People from './components/peoples/People';

import Page404 from './components/pages/Page404';

import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router';

import './index.css';

import useSelectedTheme from './hooks/useSelectedTheme';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider as ReduxProvider } from 'react-redux';

import AnonymousProtectedRoute from './components/routing/AnonymousProtectedRoute';
import AuthenticationProtectedRoute from './components/routing/AuthenticationProtectedRoute';

import reduxStore from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));

const authenticationRoutes = [
    {
        path: '/',
        component: <Register></Register>,
        protection: <AnonymousProtectedRoute></AnonymousProtectedRoute>,
    },
    {
        path: '/login/',
        component: <Login></Login>,
        protection: <AnonymousProtectedRoute></AnonymousProtectedRoute>,
    },
    {
        path: '/logout/',
        component: <Logout></Logout>,
        protection: (
            <AuthenticationProtectedRoute></AuthenticationProtectedRoute>
        ),
    },
    {
        path: '/activate/:uid/:token/',
        component: <Activation></Activation>,
        protection: <AnonymousProtectedRoute></AnonymousProtectedRoute>,
    },
];

const feedRoutes = [
    {
        path: '/feed/',
        component: <Feed></Feed>,
        protection: (
            <AuthenticationProtectedRoute></AuthenticationProtectedRoute>
        ),
    },
    {
        path: '/feed/:postId/',
        component: <PostPage></PostPage>,
        protection: (
            <AuthenticationProtectedRoute></AuthenticationProtectedRoute>
        ),
    },
];

const peopleRoutes = [
    {
        path: '/peoples/me/',
        component: <MyProfile></MyProfile>,
        protection: (
            <AuthenticationProtectedRoute></AuthenticationProtectedRoute>
        ),
    },
    {
        path: '/peoples/:profileId/',
        component: <People></People>,
        protection: (
            <AuthenticationProtectedRoute></AuthenticationProtectedRoute>
        ),
    },
];

const routes = [
    {
        path: '/not-found/',
        component: <Page404></Page404>,
    },
    ...authenticationRoutes,
    ...feedRoutes,
    ...peopleRoutes,
];

export default function App() {
    const themeMode = useSelectedTheme();

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: themeMode,
                    ...(themeMode === 'dark'
                        ? {
                              primary: {
                                  main: '#3f51b5',
                              },
                              secondary: {
                                  main: '#f50057',
                              },
                          }
                        : {}),
                },
            }),
        [themeMode]
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <Router routes={routes}></Router>
            </CssBaseline>
        </ThemeProvider>
    );
}

root.render(
    <ReduxProvider store={reduxStore}>
        <App />
    </ReduxProvider>
);
