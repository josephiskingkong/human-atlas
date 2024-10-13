import React, { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';
import '../styles/OpenSeadragonViewer.css';

const OpenSeadragonViewer = () => {
    const viewerRef = useRef(null);
    const osdViewer = useRef(null);

    useEffect(() => {
        osdViewer.current = OpenSeadragon({
            id: viewerRef.current.id,
            prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
            tileSources: "tiles.dzi",
        });

        const handleContextMenu = (e) => {
            e.preventDefault();

            console.log('Right click detected');
            const position = osdViewer.current.viewport.pointFromPixel(new OpenSeadragon.Point(e.clientX, e.clientY));

            const info = prompt("Введите информацию для этой точки:", "Новая точка");
            if (info) {
                addPoint(position.x, position.y, info);
            }
        };

        viewerRef.current.addEventListener('contextmenu', handleContextMenu);

        return () => {
            if (osdViewer.current) {
                osdViewer.current.destroy();
            }
            viewerRef.current.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    const addPoint = (x, y, info) => {
        const element = document.createElement('div');
        element.className = 'overlay';
        element.innerText = '•';
        element.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
        });
        element.addEventListener('click', (e) => {
            e.stopPropagation(); 
            alert(info);
        });

        osdViewer.current.addOverlay({
            element: element,
            location: new OpenSeadragon.Point(x, y),
            placement: OpenSeadragon.Placement.CENTER
        });
    };

    return (
        <div className="grid-container">
            <div id="openseadragon1" ref={viewerRef} className="openseadragon-viewer"></div>
            <div className="menu">
                <h1>Menu</h1>
                <span>info</span>
                <br />
                <button>OK</button>
            </div>
        </div>
    );
};

export default OpenSeadragonViewer;