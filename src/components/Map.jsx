import React, { createContext, useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import Menu from './Menu'
import '../styles/map.css';
import '../styles/fonts/fonts.css';
import CreateMenu from './CreateMenu';
import ZoomBar from './ZoomBar';
import ToolBar from './ToolBar';

const OpenSeadragonContext = createContext();

export default function Map() {
    const viewerRef = useRef(null);
    const osdViewer = useRef(null);
    const menuButton = useRef(null);
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ contentPoint, setContentPoint ] = useState('');
    const [ titlePoint, setTitlePoint ] = useState('');
    const [ positionClick, setPositionClick ] = useState(null);
    const [ currentPoint, setCurrentPoint ] = useState(null);
    const [ toolState, setToolState ] = useState('arrow');

    // http://89.187.25.16/1/tiles.dzi
    useEffect(() => {
        osdViewer.current = OpenSeadragon({
            id: viewerRef.current.id,
            prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
            tileSources: "https://humanatlas.top/1/tiles.dzi",
            zoomInButton: 'zoom-in',
            zoomOutButton: 'zoom-out'
        });

        return () => {
            if (osdViewer.current) {
                osdViewer.current.destroy();
            }
            viewerRef.current.removeEventListener('click', handleContextMenu);
        };
    }, []);

    useEffect(() => {
        osdViewer.current.addHandler('canvas-click', handleContextMenu);

        return () => {
            osdViewer.current.removeHandler('canvas-click', handleContextMenu);
        }
    }, [toolState]);

    function handleContextMenu(e) {
        if (toolState == 'add') {
            e.preventDefaultAction = true;

            // const rect = viewerRef.current.getBoundingClientRect();
            
            console.log(toolState);

            // const relativeX = e.clientX - rect.left;
            // const relativeY = e.clientY - rect.top;
        
            setPositionClick(osdViewer.current.viewport.pointFromPixel(e.position));
        
            setIsMenuOpen(false);
            setIsModalOpen(true);

            setToolState('arrow');
        }
    };

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
            }
        });

        setCurrentPoint(element);

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
        <OpenSeadragonContext.Provider value={ osdViewer }>
            <div className='map-container'>
                <ZoomBar></ZoomBar>
                <ToolBar setToolState={ setToolState }></ToolBar>

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
                    <Menu title={ titlePoint } 
                        content={ contentPoint } 
                        closeMenuHandler={ closeButtonHandler }>
                    </Menu>
                }

                { isModalOpen &&
                    <CreateMenu 
                        closeMenuHandler={ closeButtonHandler } 
                        addPoint={ addPoint } 
                        positionClick={ positionClick } 
                        setIsModalOpen={ setIsModalOpen }
                        currentElement={ currentPoint }
                        osdViewer={ osdViewer }
                        viewerRef={ viewerRef }>
                    </CreateMenu>
                }

                <div id="openseadragon1" ref={ viewerRef } className="openseadragon-viewer">
                </div>
            </div>
        </OpenSeadragonContext.Provider>
    );
}