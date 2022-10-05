import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import LoginForm from './LoginForm';

export default function Login(props) {
    const [APIErrors, setAPIErrors] = useState([]);
    const locationContext = useLocation();
    const [message, setMessage] = useState(locationContext.state.message || '');
    const [isFetching, setIsFetching] = useState(false);

    const handleSubmit = (data) => {
        setIsFetching(true);
        setAPIErrors(['not implemented']);
    };

    useEffect(() => {
        document.title = 'Войти || KWIK';
    }, []);

    return (
        <LoginForm
            title='Войти'
            isFetching={isFetching}
            message={message}
            setMessage={setMessage}
            APIErrors={APIErrors}
            submit={handleSubmit}
            setAPIErrors={setAPIErrors}></LoginForm>
    );
}
