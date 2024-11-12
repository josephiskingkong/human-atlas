import React from 'react';
import OpenSeadragonViewer from './components/OpenSeadragonViewer';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import ListOrgans from './components/ListOrgans';

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path='/human-atlas' Component={ ListOrgans } />
                <Route exact path='/human-atlas/:id' Component={ OpenSeadragonViewer } />
            </Routes>
        </Router>
    );
}

export default App;