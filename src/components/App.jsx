import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import SlidesPage from './slide-page/SlidesPage';
import Navbar from './Navbar';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/human-atlas/atlas' element = { MainPage }>
                    <Route path=':id' element = { Chapter }></Route>
                </Route>
                <Route path='/human-atlas/slides' element = { SlidesPage }>
                    <Route path=':id' element = { SlidesPage }></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;