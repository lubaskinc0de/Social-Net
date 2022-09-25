import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import Page404 from './components/Page404';

export default function Router(props) {
    const routes = props.routes.map((element) => {
        return <Route key={element.path} path={element.path} element={element.component}></Route>
    })
    return (
        <BrowserRouter>
            <Routes>
                {routes}
                <Route path='*' element={<Page404></Page404>}></Route>
            </Routes>
        </BrowserRouter>
    );
}
