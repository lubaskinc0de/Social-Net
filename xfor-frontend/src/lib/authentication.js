function handleEnter(event) {
    if (event.keyCode === 13) {
        const form = event.target.form;
        const index = [].indexOf.call(form, event.target);
        form.elements[index + 2].focus();
        event.preventDefault();
    }
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
    showComponent,
    getToken,
    setToken,
    removeToken,
};
