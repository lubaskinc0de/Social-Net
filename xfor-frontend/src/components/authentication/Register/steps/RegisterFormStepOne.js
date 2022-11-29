import React, { useState } from 'react';
import Form from '../../Form';
import { useFormik } from 'formik';
import useLoad from '../../../../hooks/useLoad';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import FormFields from '../../FormFields';

export default function RegisterFormStepOne(props) {
    const [showErrors, setShowErrors] = useState(false);
    const isLoad = useLoad(200);
    const navigate = useNavigate();
    const validationSchema = Yup.object({
        username: Yup.string()
            .max(50, 'Длина логина не должна превышать 50 символов!')
            .min(4, 'Длина логина не может быть меньше 4 символов')
            .required('Укажите логин!'),
        email: Yup.string()
            .email('Укажите правильный адрес эл.почты!')
            .required('Укажите адрес эл.почты!'),
        password: Yup.string('Пароль не должен состоять из цифр')
            .min(8, 'Длина пароля должна быть больше 8 символов')
            .required('Укажите пароль!'),
        password2: Yup.string()
            .required('Укажите пароль повторно!')
            .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать!'),
    });

    const {
        username = '',
        email = '',
        password = '',
        password2 = '',
    } = props.values;

    const formik = useFormik({
        initialValues: {
            username,
            email,
            password,
            password2,
        },
        validationSchema,
        onSubmit(values) {
            props.nextStep(values);
        },
    });

    const fields = [
        {
            name: 'username',
            type: 'text',
            label: 'Логин',
        },
        {
            name: 'email',
            type: 'email',
            label: 'Эл.почта',
        },
        {
            name: 'password',
            type: 'password',
            label: 'Пароль',
        },
        {
            name: 'password2',
            type: 'password',
            label: 'Повторите пароль',
        },
    ];

    const signInButton = (
        <Button
            type='button'
            size='large'
            fullWidth
            disabled={!isLoad}
            sx={{ mb: 2 }}
            onClick={(e) => {
                navigate('/login/');
            }}
            variant='contained'
        >
            Войти
        </Button>
    );

    return (
        <Form
            handleSubmit={formik.handleSubmit}
            setShowErrors={setShowErrors}
            buttons={{
                alterButton: signInButton,
            }}
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
