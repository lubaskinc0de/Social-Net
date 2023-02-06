import React from 'react';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ruLocale from 'date-fns/locale/ru';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function FormDatePicker(props) {
    const isMobile = useMediaQuery('(max-width:576px)');

    const pickerProps = {
        label: props.label,
        inputFormat: 'dd/MM/yyyy',
        value: props.value,
        onChange: props.handleChange,
        minDate: props.minDate,
        maxDate: props.maxDate,
        renderInput: (params) => {
            return <TextField {...params} {...props.textFieldProps} />;
        },
    };

    const getPicker = () => {
        const mobilePicker = <MobileDatePicker {...pickerProps} />;
        const desktopPicker = <DesktopDatePicker {...pickerProps} />;

        if (isMobile) {
            return mobilePicker;
        } else {
            return desktopPicker;
        }
    };
    return (
        <LocalizationProvider
            adapterLocale={ruLocale}
            dateAdapter={AdapterDateFns}
        >
            {getPicker()}
        </LocalizationProvider>
    );
}
