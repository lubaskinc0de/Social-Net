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

export { handleEnter, showComponent };
