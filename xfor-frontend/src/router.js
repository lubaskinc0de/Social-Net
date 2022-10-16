import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import Page404 from './components/pages/Page404';

export default function Router(props) {
    const routes = props.routes.map((element) => {
        if (!element.protection) {
            return (
                <Route
                    key={element.path}
                    path={element.path}
                    element={element.component}></Route>
            );
        }
        return (
            <Route key={element.path} element={element.protection}>
                <Route path={element.path} element={element.component}></Route>
            </Route>
        );
    });
    return (
        <BrowserRouter>
            <Routes>
                {routes}
                <Route path='*' element={<Page404 />}></Route>
            </Routes>
        </BrowserRouter>
    );
}
