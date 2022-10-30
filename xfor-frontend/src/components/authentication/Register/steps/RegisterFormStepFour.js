/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react';
import Form from '../../Form';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useSelector} from 'react-redux';
import FormFields from '../../FormFields';

export default function RegisterFormStepFour(props) {
    const [showErrors, setShowErrors] = useState(false);
    const isFetching = useSelector((state) => state.user.loading);
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

    return (
        <Form
            handleSubmit={(e) => {
                if (formik.isValid) {
                    formik.handleSubmit(e);
                }
                e.preventDefault();
            }}
            setShowErrors={setShowErrors}
            buttons={{
                prevButton: {prevStep: props.prevStep},
                loading: isFetching,
            }}
            fields={
                <FormFields
                    fields={fields}
                    setValue={formik.setFieldValue}
                    showErrors={showErrors}
                    handleChange={formik.handleChange}
                    setFieldError={formik.setFieldError}
                    touched={formik.touched}
                    errors={formik.errors}
                    values={formik.values}></FormFields>
            }
            title={props.title}></Form>
    );
}
