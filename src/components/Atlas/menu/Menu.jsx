import InfoBar from "./InfoBar";
import '../../../styles/components/point-menu.css';
import CloseMenuButton from "./CloseMenuButton";
import { useDispatch, useSelector } from "react-redux";
import PointInfo from "./PointInfo";
import PointMenu from "./point-menu/PointMenu";
import { useEffect, useState } from "react";
import { setIsInfoOpen, setIsMenuOpen } from "../../../redux/atlas/atlas-slice";

export default function Menu({ slideData }) {
    const isMenuOpen = useSelector((state) => state.atlas.isMenuOpen);
    const isInfoOpen = useSelector((state) => state.atlas.isInfoOpen);

    const dispatch = useDispatch();

    const [ currMenu, setCurrMenu ] = useState('info');

    useEffect(() => {
        if (isMenuOpen) setCurrMenu('menu');
        if (isInfoOpen) setCurrMenu('info');
    }, [isMenuOpen, isInfoOpen]);

    const closeMenuHandler = () => {
        console.log(currMenu);
        if (!isMenuOpen && !isInfoOpen) {
            switch (currMenu) {
                case 'menu':  
                    dispatch(setIsMenuOpen(true));

                    break;
                case 'info':
                    dispatch(setIsInfoOpen(true));
    
                    break;
                default:
                    dispatch(setIsMenuOpen(true));

                    break;
            }
        } else {
            if (isMenuOpen) {
                dispatch(setIsMenuOpen(false));
                setCurrMenu('menu');

                return;
            }
    
            if (isInfoOpen) {
                dispatch(setIsInfoOpen(false));
                setCurrMenu('info');

                return;
            }
        }
    }

    return (
        <div className="point-menu">
            <CloseMenuButton isMenuOpen={ isMenuOpen } isInfoOpen={ isInfoOpen } closeHandler={ closeMenuHandler }/>
            <InfoBar title={slideData.organ.name} category="TODO" isMenuOpen={ isMenuOpen } isInfoOpen={ isInfoOpen }/>

            { isInfoOpen &&
                <PointInfo/>
            }

            { isMenuOpen &&
                <PointMenu/>
            }
        </div>
    )
}