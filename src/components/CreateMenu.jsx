import React, { useRef } from 'react';
import OpenSeadragon from 'openseadragon';

export default function CreateMenu({ 
    closeMenuHandler, 
    addPoint, 
    positionClick, 
    setIsModalOpen, 
    currentElement, 
    osdViewer, 
    viewerRef
}) {
    const inputTitle = useRef(null);
    const inputDescription = useRef(null);

    const savePoint = () => {
        let title = inputTitle.current.value;
        let description = inputDescription.current.value;

        if (title && description) {
            addPoint(positionClick.x, positionClick.y, description, title);
        }
    };

    const changePosition = () => {
        setIsModalOpen(false);

        viewerRef.current.addEventListener('click', (e) => {
            e.preventDefaultAction = true;
            
            const rect = viewerRef.current.getBoundingClientRect();
        
            const relativeX = e.clientX - rect.left;
            const relativeY = e.clientY - rect.top;
        
            const points = osdViewer.current.viewport.pointFromPixel(new OpenSeadragon.Point(relativeX, relativeY));

            setIsModalOpen(true);
            
            osdViewer.current.updateOverlay(currentElement, new OpenSeadragon.Point(points.x, points.y));
        }, { once: true });
    };

    return (
        <div className="menu modal-point">
            <div className='menu-content'>
                <div className='title-container'>
                    <input type="text" placeholder='Название...' ref={ inputTitle } className='input-title'/>
                    <button className="close-button" onClick={ closeMenuHandler }></button>
                </div>
                <textarea placeholder='Описание...' ref={ inputDescription } className='input-description'></textarea>
                <div className='buttons-container'>
                    <button onClick={ changePosition }>ED</button>
                    <button onClick={ savePoint } className='button-save'>Сохранить</button>
                </div>
            </div>
        </div> 
    );
}