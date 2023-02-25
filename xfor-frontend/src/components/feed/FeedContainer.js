import React from 'react';

import AppContainer from '../utils/AppContainer';

export default function FeedContainer({ children }) {
    return (
        <AppContainer>
            {children}
        </AppContainer>
    );
}
