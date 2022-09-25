import React from 'react';
import TextField from '@mui/material/TextField';
import Select from './FormSelect';
import DatePicker from './FormDatePicker';
import Avatar from './FormAvatarUploader';

export default function FormInput(props) {
    const showError = (isTouched, isErrors) => {
        if (isTouched && isErrors) {
            return true;
        }
        return false;
    };

    const showErrorText = (isTouched, isErrors, show) => {
        if (isTouched && isErrors && show) {
            return props.errors[props.element.name];
        }
        return '';
    };

    const generalTextFieldProps = {
        fullWidth: true,
        error: showError(
            props.touched[props.element.name],
            props.errors[props.element.name],
        ),
        helperText: showErrorText(
            props.touched[props.element.name],
            props.errors[props.element.name],
            props.showErrors,
        ),
        FormHelperTextProps: {sx: {marginLeft: 0}},
        onBlur: props.handleBlur,
        id: props.element.name,
        name: props.element.name,
    };

    const textInput = (
        <TextField
            type={props.element.type}
            label={props.element.label}
            value={props.value}
            onChange={props.handleChange}
            {...generalTextFieldProps}
            inputProps={{
                onKeyDown: props.handleKeyDown,
            }}
        />
    );

    const picker = (
        <DatePicker
            value={props.value}
            label={props.element.label}
            handleChange={props.handleChange}
            minDate={props.element.minDate}
            maxDate={props.element.maxDate}
            textFieldProps={generalTextFieldProps}></DatePicker>
    );
    const select = (
        <Select
            loading={props.element.loading}
            textFieldProps={generalTextFieldProps}
            options={props.element.options}
            getOptionLabel={props.element.getLabel}
            label={props.element.label}
            filterOptions={props.element.filterOptions}
            render={props.element.render}
            disabled={props.element.disabled}
            compareFunc={props.element.compareFunc}
            handleChange={props.handleChange}
            value={props.value}></Select>
    );

    const avatar = (
        <Avatar
            width={props.element.width}
            height={props.element.height}
            name={props.element.name}
            setError={props.setError}
            helperText={showErrorText(
                props.touched[props.element.name],
                props.errors[props.element.name],
                props.showErrors,
            )}
            handleChange={props.handleChange}
            value={props.value}
            id={props.element.id}
            label={props.element.label}></Avatar>
    );

    const inputTypes = {
        text: textInput,
        password: textInput,
        email: textInput,
        date: picker,
        select: select,
        avatar: avatar,
    };

    return <>{inputTypes[props.element.type]}</>;
}
