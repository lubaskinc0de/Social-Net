/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react';
import Form from '../../Form';
import {useFormik} from 'formik';
import {handleEnter, useContentLoading} from '../../../../lib/authentication';
import Input from '../../FormComponents/FormInput';
import * as Yup from 'yup';
import API from '../../../../api/authentication';
import Box from '@mui/material/Box';
import {createFilterOptions} from '@mui/material/Autocomplete';
import moment from 'moment';

export default function RegisterFormStepThree(props) {
    const loadCountries = async () => {
        try {
            const res = await API.getCountries();
            setCountries(res.data);
        } catch {
            props.setAPIErrors([
                'Ошибка загрузки списка стран, повторите попытку позже.',
            ]);
        }
    };

    const isCountriesLoading = useContentLoading(loadCountries, []);
    const [showErrors, setShowErrors] = useState(false);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [isCitiesDisabled, setIsCitiesDisabled] = useState(false);

    const {
        birthday = null,
        country = null,
        city = null,
    } = props.values.profile ? props.values.profile : {};

    const validationSchema = Yup.object({
        birthday: Yup.date()
            .typeError('Введите правильную дату рождения!')
            .required('Укажите день рождения!')
            .test({
                name: 'is_older_than_fourteen',
                test(value, fail) {
                    const birthday = value
                        .toJSON()
                        .slice(0, 10)
                        .split('-')
                        .join('');

                    const yearsOld = moment().diff(
                        moment(birthday, 'YYYYMMDD'),
                        'years',
                    );

                    if (yearsOld < 14) {
                        return fail.createError({
                            message: 'Вам должно быть не меньше чем 14 лет!',
                        });
                    }

                    return true;
                },
            }),
        country: Yup.string().nullable().required('Укажите страну!'),
        city: Yup.string().nullable().required('Укажите город!'),
    });

    const formik = useFormik({
        initialValues: {
            birthday,
            country,
            city,
        },
        validationSchema,
        onSubmit(values) {
            const getFormatDate = (date) => {
                // parse YYYY-mm-dd
                if (date.length === 10) {
                    // Already YYYY-mm-dd
                    return date;
                }
                return values.birthday.toJSON().slice(0, 10);
            };

            const JSONValues = {
                ...JSON.parse(JSON.stringify(values)),
                birthday: getFormatDate(values.birthday),
            };

            props.nextStep({
                profile: JSONValues,
            });
        },
    });

    const loadCities = async () => {
        const clearCities = () => {
            formik.setFieldValue('city', null);
            setCities([]);
        };

        const fetchCities = async () => {
            try {
                const res = await API.getCities(formik.values.country);
                res.data.sort((a, b) =>
                    a.alternate_names.localeCompare(b.alternate_names),
                );
                setCities(res.data);
                setIsCitiesDisabled(false);
            } catch {
                props.setAPIErrors([
                    'Ошибка загрузки списка городов, повторите попытку позже.',
                ]);
            }
        };

        if (formik.values.country) {
            setIsCitiesDisabled(true);
            await fetchCities();
        } else {
            setIsCitiesDisabled(true);
            clearCities();
        }
    };

    const isCitiesLoading = useContentLoading(loadCities, [
        formik.values.country,
    ]);

    const fields = [
        {
            name: 'birthday',
            type: 'date',
            label: 'День рождения',

            handleChange() {
                const setValue = (val) => {
                    formik.setFieldTouched(this.name, true);
                    formik.setFieldValue(this.name, val, true);
                };
                return setValue;
            },
        },
        {
            name: 'country',
            type: 'select',
            label: 'Страна',
            options: countries,
            loading: isCountriesLoading,

            compareFunc(option, value) {
                return option.id === value.id;
            },

            getLabel(option) {
                return option.alternate_names;
            },

            render(props, option) {
                const getFlags = () => {
                    if (!option.code2) {
                        return [undefined, undefined];
                    }
                    const src = `https://flagcdn.com/w20/${option.code2.toLowerCase()}.png`;
                    const srcSet = `https://flagcdn.com/w40/${option.code2.toLowerCase()}.png 2x`;

                    return [src, srcSet];
                };

                const [flagSrc, flagSrcSet] = getFlags();

                const getImage = (src, srcSet) => {
                    if (!src) {
                        return undefined;
                    }
                    return (
                        <img
                            loading='lazy'
                            width='20'
                            src={src}
                            srcSet={srcSet}
                            alt=''
                        />
                    );
                };

                return (
                    <Box
                        component='li'
                        sx={{'& > img': {mr: 2, flexShrink: 0}}}
                        {...props}>
                        {getImage(flagSrc, flagSrcSet)}
                        {option.alternate_names}
                        {option.phone ? ` (+${option.phone})` : undefined}
                    </Box>
                );
            },

            handleChange() {
                const setValue = (event, val) => {
                    formik.setFieldValue(this.name, val ? val.id : null, true);
                };
                return setValue;
            },

            get value() {
                return countries.find(
                    ({id}) => formik.values[this.name] === id,
                );
            },
        },
        {
            name: 'city',
            type: 'select',
            label: 'Город',
            disabled: isCitiesDisabled,
            options: cities,
            loading: isCitiesLoading,

            filterOptions: createFilterOptions({
                stringify: (option) => option.alternate_names,
            }),

            compareFunc(option, value) {
                return option.id === value.id;
            },

            getLabel(option) {
                const getRegionName = () => {
                    if (!option.region) {
                        return '';
                    }
                    return `(${
                        option.region.alternate_names || option.region.name
                    })`;
                };

                return `${option.alternate_names} ${getRegionName()}`;
            },

            render(props, option) {
                const getCountryFlags = () => {
                    if (!option.country.code2) {
                        return [undefined, undefined];
                    }

                    const src = `https://flagcdn.com/w20/${option.country.code2.toLowerCase()}.png`;
                    const srcSet = `https://flagcdn.com/w40/${option.country.code2.toLowerCase()}.png 2x`;

                    return [src, srcSet];
                };

                const [flagSrc, flagSrcSet] = getCountryFlags();

                const getImage = (src, srcSet) => {
                    if (!src) {
                        return undefined;
                    }

                    return (
                        <img
                            loading='lazy'
                            width='20'
                            src={src}
                            srcSet={srcSet}
                            alt=''
                        />
                    );
                };

                const getRegionName = () => {
                    if (!option.region) {
                        return '';
                    }
                    return `(${
                        option.region.alternate_names || option.region.name
                    })`;
                };

                return (
                    <Box
                        component='li'
                        sx={{'& > img': {mr: 2, flexShrink: 0}}}
                        {...props}>
                        {getImage(flagSrc, flagSrcSet)}
                        {`${option.alternate_names} ${getRegionName()}`}
                    </Box>
                );
            },

            handleChange() {
                const setValue = (event, val) => {
                    formik.setFieldValue(this.name, val ? val.id : null, true);
                };
                return setValue;
            },

            get value() {
                return cities.find(({id}) => formik.values[this.name] === id);
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
                setValue={formik.setFieldValue}
                showErrors={showErrors}
                value={getValue()}
                handleChange={getHandleChange()}
                handleBlur={formik.handleBlur}
                handleKeyDown={handleEnter}
                touched={formik.touched}
                errors={formik.errors}></Input>
        );
    });

    return (
        <Form
            setAPIErrors={props.setAPIErrors}
            handleSubmit={formik.handleSubmit}
            APIErrors={props.APIErrors}
            setShowErrors={setShowErrors}
            buttons={{prevButton: {prevStep: props.prevStep}}}
            fields={formFields}
            title={props.title}></Form>
    );
}
