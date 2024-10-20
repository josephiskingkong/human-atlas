import React, { useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import Menu from './Menu'
import '../styles/OpenSeadragonViewer.css';
import '../styles/fonts/fonts.css';

export default function Map() {
    const viewerRef = useRef(null);
    const osdViewer = useRef(null);
    const searchBar = useRef(null);
    const menuButton = useRef(null);
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);

    useEffect(() => {
        osdViewer.current = OpenSeadragon({
            id: viewerRef.current.id,
            prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
            tileSources: "tiles.dzi",
            zoomInButton: 'zoom-in',
            zoomOutButton: 'zoom-out'
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
        // element.addEventListener('click', (e) => {
        //     e.stopPropagation(); 
        //     alert("baba");
        // });

        osdViewer.current.addOverlay({
            element: element,
            location: new OpenSeadragon.Point(x, y),
            placement: OpenSeadragon.Placement.CENTER
        });
    };

    return (
        <>
            <div className='map-container'>
                <input className='searchbar' ref={ searchBar }/>

                <div className='zoombar'>
                    <button id='zoom-in' className='zoom-buttons'>+</button>
                    <button id='zoom-out' className='zoom-buttons'>-</button>
                </div>

                <button className='menu-button' ref={ menuButton } onClick={ () => { 
                    if (isMenuOpen) {
                        setIsMenuOpen(false);
                        searchBar.current.className = 'searchbar';
                        menuButton.current.className = 'menu-button';
                    } else {
                        setIsMenuOpen(true);
                        searchBar.current.className += ' searchbar-small';
                        menuButton.current.className += ' menu-button-open';
                    }
                }}></button>

                { isMenuOpen && <div className="menu">
                    <Menu></Menu>
                </div> }

                <div id="openseadragon1" ref={viewerRef} className="openseadragon-viewer">
                </div>
            </div>
        </>
    );
}