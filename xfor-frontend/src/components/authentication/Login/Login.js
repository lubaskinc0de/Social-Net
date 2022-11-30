import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from './LoginForm';
import { useDispatch } from 'react-redux';
import { userLogin } from '../../../store/actions/userActions';

export default function Login() {
    const locationContext = useLocation();
    const [message, setMessage] = useState(
        locationContext.state ? locationContext.state.message : null || ''
    );
    const dispatch = useDispatch();

    const handleSubmit = (data) => {
        dispatch(userLogin(data));
    };

    useEffect(() => {
        document.title = 'Войти || KWIK';
    }, []);

    return (
        <LoginForm
            title='Войти'
            message={message}
            setMessage={setMessage}
            submit={handleSubmit}
        ></LoginForm>
    );
}
