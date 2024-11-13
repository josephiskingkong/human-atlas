import React, { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';
import { addPointToBack } from '../api/add-point';
import { editPoint } from '../api/edit-point';

export default function CreateMenu({
    closeMenuHandler,
    setIsModalOpen,
    currentElement,
    osdViewer,
    viewerRef,
    setToolState,
    toolState,
    title,
    content,
    id,
    setPoints
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
            console.log(title + " " + content);
        }

        return () => {
            if (saveButton.current) {
                saveButton.current.removeEventListener('click', savePoint);
                console.log("DELETE LISTENEEEEER!!!");
            }
        };
    }, [toolState]);

    const savePoint = async () => {
        let title = inputTitle.current.value;
        let description = inputDescription.current.value;

        console.log("SAVE: ", toolState);

        console.log("SAVE ID: ", id);

        if (title && description) {
            console.log(title + " " + description);
            const res = await editPoint({ id: id, name: title, description: description });
            
            setPoints((prevPoints) => {
                const newPoints = prevPoints.map((point) => {
                    if (point.id === id) {
                        console.log('POINT', point);
                        point.title = title;
                        point.info = description;
                    }

                    return point;
                });
                
                console.log(toolState);
                setToolState('arrow');
                console.log(toolState);

                return newPoints
            });

            setIsModalOpen(false);
        }
    };
    
    // await new Promise((res, rej) => {
    //     setPoints((prevPoints) => {
    //         return prevPoints.map((point) => {
    //             if (point.id === id) {
    //                 console.log('POINT', point);
    //                 point.title = title;
    //                 point.info = description;
    //             }

    //             return point;
    //         });
    //     })

    //     res(true);
    // }).then(() => {
    //     setToolState('arrow');
    //     console.log(toolState);
    //     setIsModalOpen(false);
    // })
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
                    <input type="text" placeholder={'Название...'} defaultValue={title} ref={inputTitle} className='input-title' />
                    <button className="close-button" onClick={closeMenuHandler}></button>
                </div>
                <textarea placeholder={'Описание...'} defaultValue={content} ref={inputDescription} className='input-description'></textarea>
                <div className='buttons-container'>
                    <button ref={saveButton} className='button-save'>Сохранить</button>
                </div>
            </div>
        </div>
    );
}