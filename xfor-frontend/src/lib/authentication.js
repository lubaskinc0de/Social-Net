import {useEffect, useState} from 'react';

function handleEnter(event) {
    if (event.keyCode === 13) {
        const form = event.target.form;
        const index = Array.prototype.indexOf.call(form, event.target);
        form.elements[index + 1].focus();
        event.preventDefault();
    }
}

function useLoad(time) {
    const [isLoad, setIsLoad] = useState(false)
    useEffect(() => {
        setTimeout(setIsLoad, time, true)
    }, [time])
    return isLoad
}

export {
    handleEnter,
    useLoad,
}