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
                        }, [])
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

export const getFromLocalStorage = (key) => {
    return localStorage.getItem(key);
};

export const setToLocalStorage = (key, value) => {
    return localStorage.setItem(key, value);
};

export const removeFromLocalStorage = (key) => {
    return localStorage.removeItem(key);
};

export const debounce = (f, ms) => {
    let isCooldown = false;

    return function (...args) {
        if (isCooldown) return;

        f.apply(this, args);

        isCooldown = true;

        setTimeout(() => (isCooldown = false), ms);
    };
};

export function showComponent(component, show) {
    if (!show) {
        return null;
    }
    return component;
}
