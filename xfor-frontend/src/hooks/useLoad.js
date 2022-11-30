import { useEffect, useState } from 'react';

export default function useLoad(time) {
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {
        setTimeout(setIsLoad, time, true);
    }, [time]);

    return isLoad;
}
