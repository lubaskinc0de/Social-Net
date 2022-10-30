export function parseAPIAxiosErrors(err, recursionDepth = 10) {
    if (err.response && err.response.status === 0) {
        return ['Cервер недоступен, повторите попытку позже.'];
    }

    if (err.response) {
        const isInstanceOf = (object, type) => {
            const typeName = type.name;
            const objectConstructor = object.__proto__.constructor;
            const isObjectInstanceOfType = objectConstructor.name === typeName;

            return isObjectInstanceOfType;
        };

        const getErrorsArray = (initial_array, el) => {
            if (isInstanceOf(el, Object)) {
                return getErrorsArray(
                    initial_array,
                    Object.values(el)
                        .flat(recursionDepth)
                        .reduce((arr, el) => {
                            return getErrorsArray(arr, el);
                        }, []),
                );
            }

            return [...initial_array, el];
        };

        return Object.values(err.response.data)
            .flat(recursionDepth)
            .reduce((arr, el) => {
                return getErrorsArray(arr, el);
            }, []);
    }

    if (err.request) {
        return ['Что то пошло не так, мы уже разбираемся с этим.'];
    }

    return ['Ошибка! Программист что то натворил, мы уже разбираемся с этим.'];
}

export const getTheme = () => {
    return localStorage.getItem('selectedTheme')
}

export const setTheme = (theme) => {
    localStorage.setItem('selectedTheme', theme)
}