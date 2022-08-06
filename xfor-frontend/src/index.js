import Register from './components/authentication/Register/Register';
import Login from './components/authentication/Login/Login';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

const routes = [{
    path: '/',
    component: <Register></Register>,
}, {
    path: '/login/',
    component: <Login></Login>,
}]

root.render(
    <Router routes={routes}></Router>
);
