import React from 'react';
import Map from './Map';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';

const OpenSeadragonViewer = () => {
    const { id } = useParams();

    return (
        <>
            <Navbar></Navbar>
            <Map organId={ id }></Map>
        </>
    );
};

export default OpenSeadragonViewer;