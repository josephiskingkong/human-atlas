import React, { createContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import Menu from './Menu'
import '../styles/map.css';
import '../styles/fonts/fonts.css';
import CreateMenu from './CreateMenu';
import ZoomBar from './ZoomBar';
import ToolBar from './ToolBar';
import { getPointById, getPointsByOrganId } from '../api/get-points';
import { deletePointById } from '../api/del-point';
import { addPointToBack } from '../api/add-point';
import "../OpenSeadragonScalebar/openseadragon-scalebar";
import { getOrganByOrganId } from '../api/get-organ';

const OpenSeadragonContext = createContext();

export default function Map({ organId }) {
    const viewerRef = useRef(null);
    const osdViewer = useRef(null);
    const menuButton = useRef(null);
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ idPoint, setIdPoint ] = useState(0);
    const [ contentPoint, setContentPoint ] = useState('');
    const [ titlePoint, setTitlePoint ] = useState('');
    const [ positionClick, setPositionClick ] = useState(null);
    const [ currentPoint, setCurrentPoint ] = useState(null);
    const [ toolState, setToolState ] = useState('arrow');
    const [ points, setPoints ] = useState([]);

    useEffect(() => {
        console.log("ORGAN ID", organId);

        const initializeViewer = async () => {
            osdViewer.current = OpenSeadragon({
                id: viewerRef.current.id,
                prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
                tileSources: `https://tiles.humanatlas.top/${organId}/${organId}.dzi`,
                zoomInButton: 'zoom-in',
                zoomOutButton: 'zoom-out'
            });
    
            // Ожидаем возвращение mpp_x
            const mpp_x = await getMpp();
    
            const pixelsPerMeter = 1 / (mpp_x * 1e-6);
            console.log(pixelsPerMeter);
    
            osdViewer.current.scalebar({
                type: OpenSeadragon.ScalebarType.MICROSCOPY,
                pixelsPerMeter: pixelsPerMeter,
                color: "#4670B4",
                fontColor: "#4670B4",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                barThickness: 1,
                location: OpenSeadragon.ScalebarLocation.BOTTOM_LEFT,
                xOffset: 10,
                yOffset: 10,
                minWidth: "200px",
                maxWidth: "100px",
                stayInsideImage: false
            });
    
            console.log("EFFECTS", toolState);
            console.log("POINTS", points);
        };
    
        initializeViewer();
    
        // return cleanup function
        // return () => {
        //     if (osdViewer.current) {
        //         osdViewer.current.destroy();
        //     }
        //     viewerRef.current.removeEventListener('click', handleContextMenu);
        // };
    }, []);

    async function getMpp() {
        console.log("MPP");
        const organ = await getOrganByOrganId(organId);

        console.log(organ);

        return Number(organ.mpp_x);
    }

    async function loadPointsBack() {
        let res = await getPointsByOrganId(organId);

        res.forEach((item) => addPoint(item.id, item.x, item.y, item.description, item.name));
    }

    // function loadPoints() {
    //     if (!points && points.length === 0) {
    //         return;
    //     }

    //     console.log("LOAD");
    //     console.log(points);

    //     points.forEach((item) => {
    //         console.log(item);
    //         addPoint(item.id, item.x, item.y, item.description, item.name);
    //     });
    // }

    function removeOverlays() {
        points.forEach((item) => osdViewer.current.removeOverlay(item.element));
    }

    async function onClickElement(id, info, title, element, toolState, e) {
        e.stopPropagation();

        console.log("CLICKELEMENT");
        console.log(toolState);
        console.log(element);

        if (toolState === 'del') {
            e.preventDefaultAction = true;
            osdViewer.current.removeOverlay(element);
            const res = await deletePointById(id);
            console.log(res);
            setPoints((prevPoints) => prevPoints.filter((point) => point.id !== id));

            setToolState('arrow');

            if (idPoint === id) {
                setIsMenuOpen(false);
                setIsModalOpen(false);
            }

            console.log(toolState);
        }

        if (toolState === 'arrow') {
            console.log("ARROW: ", toolState);
            
            console.log(info + " " + title);

            setContentPoint(info);
            setTitlePoint(title);
            setIdPoint(id);
            setIsModalOpen(false);
            setIsMenuOpen(true);

            // element.removeEventListener('pointerdown', handleClickElement);
        }

        if (toolState === 'pen') {
            setContentPoint(info);
            setTitlePoint(title);
            setIdPoint(id);

            console.log("PEEEEEEEEEEN", toolState);
            console.log(title + " " + info);

            setIsModalOpen(true);
            setIsMenuOpen(false);
            // element.addEventListener('pointerdown', handleClickElement);

            console.log(toolState);
        }
    }

    useEffect(() => {
        console.log("CONTEEEENT", contentPoint);
    }, [contentPoint]);

    const addPoint = (id, x, y, info, title) => {
        const element = document.createElement('div');  
        element.className = 'overlay';
        element.innerText = '';

        console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF", toolState);

        element.addEventListener('pointerdown', (e) => onClickElement(id, info, title, element, toolState, e));

        console.log("X: ", x);
        console.log("Y: ", y);
        console.log(points);

        setPoints((prevPoints) => 
            [...prevPoints, { 
                element: element,
                id: id,
                x: x,
                y: y,
                info: info,
                title: title
            }]
        );

        osdViewer.current.addOverlay({
            element: element,
            location: new OpenSeadragon.Point(x, y - 0.00027),
            placement: OpenSeadragon.Placement.CENTER
        });
    };

    // http://89.187.25.16/1/tiles.dzi

    // useEffect(() => {
    //     if (toolState === 'pen') {
    //         console.log(toolState);
    //         setToolState('arrow');
    //     }
    // }, [points]);

    useEffect(() => {
        osdViewer.current.addHandler('canvas-click', handleContextMenu);

        loadPointsBack();

        console.log("TOOLSTATE22222: ", toolState);
        console.log(points);
        return () => {
            console.log(points);
            osdViewer.current.removeHandler('canvas-click', handleContextMenu);
            setPoints([]);
            removeOverlays();
        }
    }, [toolState]);

    async function handleContextMenu(e) {
        if (toolState === 'add') {
            e.preventDefaultAction = true;

            // const rect = viewerRef.current.getBoundingClientRect();
            
            console.log("MENU", toolState);

            // const relativeX = e.clientX - rect.left;
            // const relativeY = e.clientY - rect.top;
            
            const position = osdViewer.current.viewport.pointFromPixel(e.position);

            const res = await addPointToBack(position.x, position.y, organId, '', '');
            console.log("POINT ID", res.point_id);

            setIdPoint(res.point_id);
            addPoint(res.point_id, position.x, position.y, '', '');

            setPositionClick(position);
            setTitlePoint('');
            setContentPoint('');

            setIsMenuOpen(false);
            setIsModalOpen(true);
            
        }
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
                    <Menu 
                        title={ titlePoint } 
                        content={ contentPoint } 
                        closeMenuHandler={ closeButtonHandler }>
                    </Menu>
                }

                { isModalOpen &&
                    <CreateMenu 
                        closeMenuHandler={ closeButtonHandler }
                        setIsModalOpen={ setIsModalOpen }
                        currentElement={ currentPoint }
                        osdViewer={ osdViewer }
                        viewerRef={ viewerRef }
                        setToolState={ setToolState }
                        toolState={ toolState }
                        addPoint={addPoint}
                        title={titlePoint}
                        content={contentPoint}
                        id={idPoint}
                        setPoints={setPoints}>
                    </CreateMenu>
                }

                <div id="openseadragon1" ref={ viewerRef } className="openseadragon-viewer">
                </div>
            </div>
        </OpenSeadragonContext.Provider>
    );
}