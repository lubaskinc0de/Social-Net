import {useEffect, useState} from 'react';

export default function useContentLoading(effect, dependencies) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true);
            await effect();
            setIsLoading(false);
        };
        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    return isLoading;
}