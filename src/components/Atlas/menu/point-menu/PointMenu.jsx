import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HintMenu from "./HintMenu";
import { editPoint } from "../../../../hooks/points/editPoint";
import { setCurrMenu, setTargetPoint } from "../../../../redux/atlas/atlas-slice";
import DeleteModal from "./DeleteModal";
import { deletePointById } from "../../../../hooks/points/deletePoint";
import pencil from "../../../../assets/images/pencil.svg"
import pencilBlue from "../../../../assets/images/pencil-blue.svg"
import eye from "../../../../assets/images/eye.svg"
import eyeBlue from "../../../../assets/images/eye-blue.svg"
import Markdown from "../../../Common/Markdown";
import ButtonIcon from "./ButtonIcon";
import "../../../../styles/components/menu/point-menu.css";

export default function PointMenu() {
    const targetPoint = useSelector((state) => state.atlas.targetPoint);
    const dispatch = useDispatch();

    const [ titlePoint, setTitlePoint ] = useState('');
    const [ infoPoint, setInfoPoint ] = useState('');
    const [ isFocus, setIsFocus ] = useState(false);
    const [ isDelModalOpen, setIsDelModalOpen ] = useState(false);
    const [ isMarkdown, setIsMarkdown ] = useState(true);
    const [ activeButton, setActiveButton ] = useState('markdown');

    const textArea = useRef(null);

    useEffect(() => {
        setTitlePoint(targetPoint.name);
        setInfoPoint(targetPoint.description);
    }, [targetPoint])

    const saveHandler = async () => {
        let id = targetPoint.id;
        let title = titlePoint;
        let description = infoPoint;

        console.log('CLICK', id, title, description);

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

    const textAreaHandler = (event) => {
        if (isFocus) {
            const textarea = textArea.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            
            const selectedText = infoPoint.slice(start, end);

            if (event.ctrlKey && event.key === "b") {
                event.preventDefault();
                setInfoPoint(`${infoPoint.slice(0, start)}**${selectedText}**${infoPoint.slice(end)}`);
            } else if (event.ctrlKey && event.key === "i") {
                event.preventDefault();
                setInfoPoint(`${infoPoint.slice(0, start)}*${selectedText}*${infoPoint.slice(end)}`);
            } else if (event.ctrlKey && event.key === "u") {
                event.preventDefault();
                setInfoPoint(`${infoPoint.slice(0, start)}<u>${selectedText}</u>${infoPoint.slice(end)}`);
            }
        }
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
                ></input>
                <div className="textarea-container">
                    <div className="view-info-buttons">
                        <ButtonIcon 
                            alt={ 'markdown' } 
                            isActive={ activeButton === 'markdown' } 
                            onClick={ () => {
                                setActiveButton('markdown');
                                setIsMarkdown(true);
                            }}
                        >{ activeButton === 'markdown' ? pencil : pencilBlue }</ButtonIcon>
                        <ButtonIcon 
                            alt={ 'view' } 
                            isActive={ activeButton === 'view' } 
                            onClick={ () => { 
                                setActiveButton('view');
                                setIsMarkdown(false);
                            }}
                        >{ activeButton === 'view' ? eye : eyeBlue }</ButtonIcon>
                    </div>
                    <div className="input-info-container">
                        { isMarkdown && 
                            <textarea type="text" className="input-info"
                                ref={ textArea }
                                value={ infoPoint }
                                onChange={ (event) => setInfoPoint(event.target.value) }
                                onKeyDown={ textAreaHandler }
                                onFocus={ () => setIsFocus(true) }
                                onBlur={ () => setIsFocus(false) }
                            />
                        }

                        { !isMarkdown &&
                            <div className="markdown-info">
                                <Markdown>{ infoPoint }</Markdown>
                            </div>
                        }
                    </div>
                </div>
                <div className="point-info-buttons">
                    <button className="save-button" onClick={ saveHandler }>Сохранить</button>
                    <button className="del-button" onClick={ () => setIsDelModalOpen(true) }>Удалить</button>
                </div>
            </div>
        </>
    )
}