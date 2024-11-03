import React, { useRef } from 'react';

export default function CreateMenu({ closeMenuHandler, addPoint, positionClick, setIsModalOpen }) {
    const inputTitle = useRef(null);
    const inputDescription = useRef(null);

    const savePoint = () => {
        let title = inputTitle.current.value;
        let description = inputDescription.current.value;

        if (title && description) {
            addPoint(positionClick.x, positionClick.y, description, title);
        }

        setIsModalOpen(false);
    };

    return (
        <div className="menu modal-point">
            <div className='menu-content'>
                <div className='title-container'>
                    <input type="text" placeholder='Название...' ref={ inputTitle } className='input-title'/>
                    <button className="close-button close-button-point" onClick={ closeMenuHandler }></button>
                </div>
                <textarea placeholder='Описание...' ref={ inputDescription } className='input-description'></textarea>
                <button onClick={ savePoint } className='button-save'>Сохранить</button>
            </div>
        </div> 
    );
}