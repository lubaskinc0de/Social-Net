/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react';
import Form from '../../Form';
import {useFormik} from 'formik';
import Input from '../../FormComponents/FormInput';
import * as Yup from 'yup';

export default function RegisterFormStepFour(props) {
    const [showErrors, setShowErrors] = useState(false);

    const {avatar = ''} = props.values;

    const validationSchema = Yup.object({
        avatar: Yup.array().nullable(),
    });

    const formik = useFormik({
        initialValues: {
            avatar,
        },
        validationSchema,
        onSubmit(values) {
            props.nextStep({
                profile: values,
            });
        },
    });

    const fields = [
        {
            name: 'avatar',
            type: 'avatar',
            label: 'Фото профиля',
            width: 100,
            height: 100,

            handleChange() {
                const setValue = (val, shouldValidate = true) => {
                    formik.setFieldTouched(this.name, true, shouldValidate);
                    formik.setFieldValue(this.name, val, shouldValidate);
                };
                return setValue;
            },
        },
    ];

    const formFields = fields.map((element) => {
        const getValue = () => {
            if (element.hasOwnProperty('value')) {
                return element.value;
            }
            return formik.values[element.name];
        };

        const getHandleChange = () => {
            if (element.hasOwnProperty('handleChange')) {
                return element.handleChange();
            }
            return formik.handleChange;
        };

        return (
            <Input
                key={element.name}
                element={element}
                showErrors={showErrors}
                value={getValue()}
                handleChange={getHandleChange()}
                touched={formik.touched}
                errors={formik.errors}
                setError={formik.setFieldError}></Input>
        );
    });

    return (
        <Form
            setAPIErrors={props.setAPIErrors}
            handleSubmit={(e) => {
                if (formik.isValid) {
                    formik.handleSubmit(e);
                }
                e.preventDefault();
            }}
            APIErrors={props.APIErrors}
            setShowErrors={setShowErrors}
            buttons={{
                prevButton: {prevStep: props.prevStep},
                loading: props.isFetching,
            }}
            fields={formFields}
            title={props.title}></Form>
    );
}
