function handleEnter(event) {
    if (event.keyCode === 13) {
        const form = event.target.form;
        const index = [].indexOf.call(form, event.target);
        form.elements[index + 2].focus();
        event.preventDefault();
    }
}

function parseAPIAxiosErrors(err, recursionDepth = 10) {
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

function showComponent(component, show) {
    if (!show) {
        return null;
    }
    return component;
}

function getToken() {
    return localStorage.getItem('userToken');
}

function setToken(token) {
    localStorage.setItem('userToken', token);
}

function removeToken() {
    localStorage.removeItem('userToken');
}

export {
    handleEnter,
    parseAPIAxiosErrors,
    showComponent,
    getToken,
    setToken,
    removeToken,
};
