import { useEffect, useState } from 'react';

/**
 * Returns isLoad with false state, set state to true through time
 * @param {Number} time 
 * @returns {Boolean}
 */
export default function useLoad(time) {
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {
        setTimeout(setIsLoad, time, true);
    }, [time]);

    return isLoad;
}
