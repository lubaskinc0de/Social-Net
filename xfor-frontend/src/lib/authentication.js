import {useEffect, useState} from 'react';

function handleEnter(event) {
    if (event.keyCode === 13) {
        const form = event.target.form;
        const index = [].indexOf.call(form, event.target);
        form.elements[index + 2].focus();
        event.preventDefault();
    }
}

function useLoad(time) {
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {
        setTimeout(setIsLoad, time, true);
    }, [time]);

    return isLoad;
}

function useContentLoading(effect, dependencies) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true);
            await effect()
            setIsLoading(false);
        }
        fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    return isLoading;
}

function parseAPIAxiosErrors(err) {
    if (err.response && err.response.status === 0) {
        return ['Cервер недоступен, повторите попытку позже.'];
    }

    if (err.response) {
        const getErrorsArray = (initial_array, el) => {
            if (el instanceof Array) {
                return [...initial_array, ...el];
            }
            if (el instanceof Object) {
                return getErrorsArray(
                    initial_array,
                    Object.values(el).reduce((arr, el) => {
                        return getErrorsArray(arr, el);
                    }, []),
                );
            }
            return [...initial_array, el];
        };

        return Object.values(err.response.data).reduce((arr, el) => {
            return getErrorsArray(arr, el);
        }, []);
    }

    if (err.request) {
        return ['Что то пошло не так, мы уже разбираемся с этим.'];
    }

    return ['Ошибка! Программист что то натворил, мы уже разбираемся с этим.'];
}

function showComponent(component, show) {
    if (!show) {
        return null;
    }
    return component;
}

const shiftWithoutMutation = (array) => {
    return array.filter((element) => {
        return element !== array[0];
    })
};

export {
    handleEnter,
    useLoad,
    useContentLoading,
    parseAPIAxiosErrors,
    showComponent,
    shiftWithoutMutation,
};
