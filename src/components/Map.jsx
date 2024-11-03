import React, { useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import Menu from './Menu'
import '../styles/map.css';
import '../styles/fonts/fonts.css';
import CreateMenu from './CreateMenu';
import ZoomBar from './ZoomBar';

export default function Map() {
    const viewerRef = useRef(null);
    const osdViewer = useRef(null);
    const menuButton = useRef(null);
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ contentPoint, setContentPoint ] = useState('');
    const [ titlePoint, setTitlePoint ] = useState('');
    const [ positionClick, setPositionClick ] = useState({});

    // http://89.187.25.16/1/tiles.dzi
    useEffect(() => {
        osdViewer.current = OpenSeadragon({
            id: viewerRef.current.id,
            prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
            tileSources: "https://humanatlas.top/1/tiles.dzi",
            zoomInButton: 'zoom-in',
            zoomOutButton: 'zoom-out'
        });

        const handleContextMenu = (e) => {
            e.preventDefault();
        
            const rect = viewerRef.current.getBoundingClientRect();
        
            const relativeX = e.clientX - rect.left;
            const relativeY = e.clientY - rect.top;
        
            setPositionClick(osdViewer.current.viewport.pointFromPixel(new OpenSeadragon.Point(relativeX, relativeY)));
        
            // menuButton.current.className += 'menu-button-close';
            setIsMenuOpen(false);
            setIsModalOpen(true);
        };

        viewerRef.current.addEventListener('contextmenu', handleContextMenu);

        return () => {
            if (osdViewer.current) {
                osdViewer.current.destroy();
            }
            viewerRef.current.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    const addPoint = (x, y, info, title) => {
        const element = document.createElement('div');
        element.className = 'overlay';
        element.innerText = '•';
        element.addEventListener('pointerdown', (e) => {
            e.stopPropagation();

            if (e.button === 0) {
                setContentPoint(info);
                setTitlePoint(title);
                setIsModalOpen(false);
                setIsMenuOpen(true);
                // menuButton.current.className += ' menu-button-close';
            }
        });

        osdViewer.current.addOverlay({
            element: element,
            location: new OpenSeadragon.Point(x, y),
            placement: OpenSeadragon.Placement.CENTER
        });
    };

    function closeButtonHandler() {
        setIsMenuOpen(false);
        setIsModalOpen(false);
        // menuButton.current.className = 'menu-button';
    }

    return (
        <>
            <div className='map-container'>
                <ZoomBar></ZoomBar>

                { !isMenuOpen && !isModalOpen &&
                    <button className='menu-button' ref={ menuButton } onClick={ () => { 
                        if (isMenuOpen) {
                            setIsMenuOpen(false);
                        } else {
                            setIsMenuOpen(true);
                        }
                    }}></button>
                }

                { isMenuOpen && 
                    <Menu title={ titlePoint } content={ contentPoint } closeMenuHandler={ closeButtonHandler }></Menu>
                }

                { isModalOpen &&
                    <CreateMenu closeMenuHandler={ closeButtonHandler } addPoint={ addPoint } positionClick={ positionClick } setIsModalOpen={ setIsModalOpen }></CreateMenu>
                }

                <div id="openseadragon1" ref={viewerRef} className="openseadragon-viewer">
                </div>
            </div>
        </>
    );
}