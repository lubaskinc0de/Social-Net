/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable default-case */
import React, {useEffect, useState} from 'react';
import RegisterForm from './RegisterForm';
import RegisterFormStep2 from './RegisterFormStep2';
import {useNavigate} from 'react-router-dom';
import API from '../../../api/authentication';

export default function Register() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [APIErrors, setAPIErrors] = useState([]);
    const navigate = useNavigate();
    const lastStep = 1;

    const handleSubmit = () => {
        API.register(formData)
            .then(() => {
                navigate('/login/');
            })
            .catch((err) => {
                prevStep();
                if (err.code === 'ERR_NETWORK') {
                    setAPIErrors([
                        'Cервер недоступен, повторите попытку позже.',
                    ]);
                    return;
                }
                setAPIErrors(
                    Object.values(err.response.data).reduce((arr, el) => {
                        if (el instanceof Array) {
                            return [...arr, ...el];
                        }
                        return [...arr, el];
                    }),
                );
            });
    };

    useEffect(() => {
        document.title = 'Регистрация';
    });

    useEffect(() => {
        if (step > lastStep) {
            handleSubmit();
        }
    });

    const nextStep = (values) => {
        setFormData({
            ...formData,
            ...values,
        });
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    switch (step) {
        case 0:
            return (
                <RegisterForm
                    APIErrors={APIErrors}
                    values={formData}
                    nextStep={nextStep}></RegisterForm>
            );
        default:
            return (
                <RegisterFormStep2
                    APIErrors={APIErrors}
                    circle={<div className='circle circle--login'></div>}
                    values={formData}
                    nextStep={nextStep}
                    prevStep={prevStep}></RegisterFormStep2>
            );
    }
}
