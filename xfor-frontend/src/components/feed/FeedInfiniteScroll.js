import React, { useCallback, useEffect, useRef } from 'react';

export default function FeedInfiniteScroll({ onIntersecting }) {
    const loader = useRef(null);

    const handleObserver = useCallback(
        (entries) => {
            const target = entries[0];
            if (target.isIntersecting) {
                onIntersecting();
            }
        },
        [onIntersecting]
    );

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: '0px',
            threshold: 1.0,
        };
        const observer = new IntersectionObserver(handleObserver, option);

        if (loader.current) {
            observer.observe(loader.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [handleObserver]);

    return <div ref={loader}></div>;
}
