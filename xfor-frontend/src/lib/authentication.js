/**
 * Switch to the next input on user press 'Enter'
 * @param {Promise<(import('react').SyntheticEvent} event
 */
export function handleEnter(event) {
    if (event.keyCode === 13) {
        const form = event.target.form;
        const index = [].indexOf.call(form, event.target);
        form.elements[index + 2].focus();
        event.preventDefault();
    }
}
