import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function FormSelect(props) {
    
    const compare = (option, value) => {
        if (props.hasOwnProperty('compareFunc')) {
            return props.compareFunc(option, value);
        }
        return option === value;
    };

    const getLabel = (option) => {
        if (props.hasOwnProperty('getOptionLabel')) {
            return props.getOptionLabel(option);
        }
        return option;
    };

    const render = (renderProps, option) => {
        if (props.hasOwnProperty('render')) {
            return props.render(renderProps, option);
        }
        return (
            <Box component='li' {...props}>
                {option}
            </Box>
        );
    };

    const renderInput = (params) => {

        const getEndAdornment = () => {
            if (props.loading) {
                return <CircularProgress color='inherit' size={20} />;
            }
            return null;
        };

        return (
            <TextField
                {...params}
                label={props.label || ''}
                InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <>
                            {getEndAdornment()}
                            {params.InputProps.endAdornment}
                        </>
                    ),
                }}
                {...props.textFieldProps}
            />
        );
    };

    return (
        <Autocomplete
            loading={props.loading}
            disablePortal
            filterOptions={props.filterOptions}
            disabled={props.disabled}
            isOptionEqualToValue={compare}
            options={!props.options.length ? [] : props.options}
            fullWidth
            getOptionLabel={getLabel}
            onChange={props.handleChange}
            value={props.value || null}
            renderOption={render}
            renderInput={renderInput}
        />
    );
}
