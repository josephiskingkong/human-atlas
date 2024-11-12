import React, { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';
import { addPointToBack } from '../../api/add-point';
import { editPoint } from '../../api/edit-point';

export default function CreateMenu({ 
    closeMenuHandler,
    positionClick, 
    setIsModalOpen, 
    currentElement, 
    osdViewer, 
    viewerRef,
    toolState,
    title,
    content,
    id
}) {
    const inputTitle = useRef(null);
    const inputDescription = useRef(null);
    const saveButton = useRef(null);

    useEffect(() => {
        console.log("IMAAAA");
        console.log(title + " " + content + " " + id);  
    }, [])

    useEffect(() => {
        if (saveButton.current) {
            saveButton.current.addEventListener('click', savePoint);
            console.log("ADD LISTENEEEER!!!", toolState);
        }
    
        return () => {
            if (saveButton.current) {
                saveButton.current.removeEventListener('click', savePoint);
                console.log("DELETE LISTENEEEEER!!!");
            }
        };
    }, [toolState]);

    const savePoint = () => {
        let title = inputTitle.current.value;
        let description = inputDescription.current.value;
        
        console.log("SAVE: ", toolState);

        console.log("SAVE ID: ", id);

        if (title && description) {
            editPoint({ id: id, name: title, description: description });
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
                    <input type="text" placeholder={ 'Название...' } defaultValue={ title } ref={ inputTitle } className='input-title'/>
                    <button className="close-button" onClick={ closeMenuHandler }></button>
                </div>
                <textarea placeholder={ 'Описание...' } defaultValue={ content } ref={ inputDescription } className='input-description'></textarea>
                <div className='buttons-container'>
                    <button onClick={ changePosition }>ED</button>
                    <button ref={ saveButton } className='button-save'>Сохранить</button>
                </div>
            </div>
        </div> 
    );
}
