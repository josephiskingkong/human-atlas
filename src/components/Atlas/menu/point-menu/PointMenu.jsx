import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HintMenu from "./HintMenu";
import { editPoint } from "../../../../hooks/points";
import { setCurrMenu, setIsMenuOpen, setTargetPoint } from "../../../../redux/atlas/atlas-slice";
import DeleteModal from "./DeleteModal";
import { deletePointById } from "../../../../hooks/points";

export default function PointMenu() {
    const targetPoint = useSelector((state) => state.atlas.targetPoint);
    const dispatch = useDispatch();

    const [ titlePoint, setTitlePoint ] = useState('');
    const [ infoPoint, setInfoPoint ] = useState('');
    const [ isFocus, setIsFocus ] = useState(false);
    const [ isDelModalOpen, setIsDelModalOpen ] = useState(false);

    useEffect(() => {
        setTitlePoint(targetPoint.name);
        setInfoPoint(targetPoint.description);
    }, [targetPoint])

    const saveHandler = async () => {
        let id = targetPoint.id;
        let title = titlePoint;
        let description = infoPoint;

        if (title && description) {
            console.log(title + " " + description);
            
            saveToBack(id, title, description);

            const newPoint = {
                ...targetPoint,
                id,
                name: title,
                description
            };
            
            dispatch(setTargetPoint({ ...newPoint }));
            console.log(newPoint);

            dispatch(setCurrMenu('close'));
        }
    };
    
    const saveToBack = async (id, title, description) => {
        const res = await editPoint({ id, name: title, description });
        console.log(res);
    };

    const delPoint = async () => {
        delFromBack(targetPoint.id);
        
        dispatch(setTargetPoint({ id: targetPoint.id, status: 'del' }));
        dispatch(setCurrMenu('close'));
    }
    
    const delFromBack = async (id) => {
        const res = await deletePointById(id);
        console.log(res);
    }

    const closeModal = () => {
        setIsDelModalOpen(false);
    };
    
    return (
        <> 
            { isDelModalOpen &&
                <DeleteModal close={ closeModal } del={ delPoint }></DeleteModal>
            }

            { isFocus && 
                <HintMenu/>
            }

            <div className='point-menu-container'>
                <input type="text" className="input-title"
                    value={ titlePoint }
                    onChange={ (event) => setTitlePoint(event.target.value) }
                    onFocus={ () => setIsFocus(true) }
                    onBlur={ () => setIsFocus(false) }
                ></input>
                <textarea type="text" className="input-info"
                    value={ infoPoint }
                    onChange={ (event) => setInfoPoint(event.target.value) }
                    onFocus={ () => setIsFocus(true) }
                    onBlur={ () => setIsFocus(false) }
                />
                <div className="point-info-buttons">
                    <button className="save-button" onClick={ saveHandler }>Сохранить</button>
                    <button className="del-button" onClick={ () => setIsDelModalOpen(true) }>Удалить</button>
                </div>
            </div>
        </>
    )
}