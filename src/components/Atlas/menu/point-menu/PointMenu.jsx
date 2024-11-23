import '../../../../styles/components/point-menu.css';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HintMenu from "./HintMenu";
import { editPoint } from "../../../../hooks/points";
import { setIsMenuOpen, setTargetPoint } from "../../../../redux/atlas/atlas-slice";
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
            const res = await editPoint({ id: id, name: title, description: description });
            
            const newPoint = {
                ...targetPoint,
                id: id,
                name: title,
                description: description
            };
            
            dispatch(setTargetPoint({ ...newPoint }));
            console.log(newPoint);

            dispatch(setIsMenuOpen(false));
        }
    };
    
    
    const delPoint = async () => {
        const res = await deletePointById(targetPoint.id);
        console.log(res);
        
        dispatch(setTargetPoint({ id: targetPoint.id, status: 'del' }));
        dispatch(setIsMenuOpen(false));
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

            <div className="point-menu-container">
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