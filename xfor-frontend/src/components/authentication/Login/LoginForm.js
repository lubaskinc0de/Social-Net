import React, {useState} from 'react';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {handleEnter, useLoad} from '../../../lib/authentication';
import Input from '../FormComponents/FormInput';
import Form from '../Form';
import Button from '@mui/material/Button';
import {useNavigate} from 'react-router-dom';

export default function LoginForm(props) {
    const [showErrors, setShowErrors] = useState(false);
    const navigate = useNavigate();
    const isLoad = useLoad(200);

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

    const formFields = fields.map((element) => {
        return (
            <Input
                key={element.name}
                showErrors={showErrors}
                element={element}
                value={formik.values[element.name]}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                handleKeyDown={handleEnter}
                touched={formik.touched}
                errors={formik.errors}></Input>
        );
    });

    const signUpButton = (
        <Button
            type='button'
            size='large'
            fullWidth
            disabled={!isLoad}
            sx={{mb: 2}}
            onClick={(e) => {
                navigate('/');
            }}
            variant='contained'>
            Регистрация
        </Button>
    );

    return (
        <Form
            setAPIErrors={props.setAPIErrors}
            APIErrors={props.APIErrors}
            handleSubmit={formik.handleSubmit}
            setShowErrors={setShowErrors}
            buttons={{
                alterButton: signUpButton,
                loading: props.isFetching,
            }}
            message={props.message}
            setMessage={props.setMessage}
            fields={formFields}
            title={props.title}></Form>
    );
}
