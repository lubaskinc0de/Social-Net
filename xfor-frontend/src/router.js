import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';

export default function Router(props) {
    const routes = props.routes.map((element) => {
        return <Route key={element.path} path={element.path} element={element.component}></Route>
    })
    return (
        <BrowserRouter>
            <Routes>
                {routes}
            </Routes>
        </BrowserRouter>
    );
}
