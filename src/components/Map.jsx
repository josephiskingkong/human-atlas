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
    const inputTitle = useRef(null);
    const inputDescription = useRef(null);
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

        // fetch('http://localhost:3001/tiles.dzi')
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Ошибка сети при получении DZI-файла');
        //         }
        //         return response.url;
        //     })
        //     .then(url => {
        //         osdViewer.current = OpenSeadragon({
        //             id: viewerRef.current.id,
        //             prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        //             tileSources: "http://localhost:3001/tiles.dzi",
        //             zoomInButton: 'zoom-in',
        //             zoomOutButton: 'zoom-out'
        //         });
        //     })
        //     .catch(error => console.error('Ошибка при получении DZI-файла:', error));

        const handleContextMenu = (e) => {
            e.preventDefault();

            console.log('Right click detected');
            setPositionClick(osdViewer.current.viewport.pointFromPixel(new OpenSeadragon.Point(e.clientX, e.clientY)));
            
            menuButton.current.className += 'menu-button-close';
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

    const savePoint = (event) => {
        let title = inputTitle.current.value;
        let description = inputDescription.current.value;

        if (title && description) {
            addPoint(positionClick.x, positionClick.y, description, title);
        }

        menuButton.current.className = 'menu-button';
        setIsModalOpen(false);
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
                menuButton.current.className += ' menu-button-close';
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
        menuButton.current.className = 'menu-button';
    }

    return (
        <>
            <div className='map-container'>
                { isMenuOpen && <input className='searchbar' placeholder='Поиск...' ref={ searchBar }/> }
                
                { isModalOpen &&
                    <div className="menu modal-point">
                        <button className="close-button close-button-point" onClick={ closeButtonHandler }></button>
                        <input type="text" placeholder='Название...' ref={ inputTitle } className='input-title'/>
                        <textarea placeholder='Описание...' ref={ inputDescription } className='input-description'></textarea>
                        <button onClick={ savePoint } className='button-save'>Сохранить</button>
                    </div> 
                }

                <div className='zoombar'>
                    <button id='zoom-in' className='zoom-buttons'>+</button>
                    <button id='zoom-out' className='zoom-buttons'>-</button>
                </div>

                <button className='menu-button' ref={ menuButton } onClick={ () => { 
                    if (isMenuOpen) {
                        setIsMenuOpen(false);
                        menuButton.current.className = 'menu-button';
                    } else {
                        setIsMenuOpen(true);
                        menuButton.current.className += ' menu-button-close';
                    }
                }}></button>

                { isMenuOpen && <div className="menu">
                    <Menu title={ titlePoint } content={ contentPoint } closeMenuHandler={ closeButtonHandler }></Menu>
                </div> }

                <div id="openseadragon1" ref={viewerRef} className="openseadragon-viewer">
                </div>
            </div>
        </>
    );
}