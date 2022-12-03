import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

export default function Page404() {
    const typedElement = useRef(null);

    useEffect(() => {
        const typed = new Typed(typedElement.current, {
            strings: [
                'Упс!^1000 Похоже вы потерялись!. <br /> ^1000' +
                    'Извините. <br /> ^1000' +
                    'Страница которую вы запросили <strong>не существует.</strong> <br /> ^1000',
            ],
            typeSpeed: 20,
            showCursor: false,
        });

        // Destroying
        return () => {
            typed.destroy();
        };
    });

    return (
        <div
            className='page-404__container'
            style={{
                color: '#fff',
            }}
        >
            <div className='page-404__content'>
                <div className='page-404__browser-bar'>
                    <div className='page-404__browser-bar__icons'>
                        <span className='page-404__close page-404__button'></span>
                        <span className='page-404__min page-404__button'></span>
                        <span className='page-404__max page-404__button'></span>
                    </div>
                    <p className='page-404__browser-bar__title'>404.txt</p>
                </div>
                <div className='page-404__text' ref={typedElement}></div>
            </div>
        </div>
    );
}
