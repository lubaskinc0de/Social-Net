import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import useLoad from '../../../hooks/useLoad';
import Form from '../Form';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FormFields from '../FormFields';

export default function LoginForm(props) {
    const [showErrors, setShowErrors] = useState(false);
    const navigate = useNavigate();
    const isLoad = useLoad(200);
    const { loading } = useSelector((state) => state.user);

    const validationSchema = Yup.object({
        username: Yup.string()
            .max(50, 'Длина логина не должна превышать 50 символов!')
            .min(4, 'Длина логина не может быть меньше 4 символов')
            .required('Укажите логин!'),

        password: Yup.string('Пароль не должен состоять из цифр')
            .min(8, 'Длина пароля должна быть больше 8 символов')
            .required('Укажите пароль!'),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema,
        onSubmit(values) {
            props.submit(values);
        },
    });

    const fields = [
        {
            name: 'username',
            type: 'text',
            label: 'Логин',
        },
        {
            name: 'password',
            type: 'password',
            label: 'Пароль',
        },
    ];

    const signUpButton = (
        <Button
            type='button'
            size='large'
            fullWidth
            disabled={!isLoad}
            sx={{ mb: 2 }}
            onClick={(e) => {
                navigate('/');
            }}
            variant='contained'
        >
            Регистрация
        </Button>
    );

    return (
        <Form
            handleSubmit={formik.handleSubmit}
            setShowErrors={setShowErrors}
            buttons={{
                alterButton: signUpButton,
                loading: loading,
            }}
            message={props.message}
            setMessage={props.setMessage}
            fields={
                <FormFields
                    fields={fields}
                    showErrors={showErrors}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    touched={formik.touched}
                    errors={formik.errors}
                    values={formik.values}
                ></FormFields>
            }
            title={props.title}
        ></Form>
    );
}
