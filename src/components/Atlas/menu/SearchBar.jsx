import { useDispatch, useSelector } from 'react-redux';
import divider from '../../../assets/images/divider.svg';
import search from '../../../assets/images/search.svg';
import { setCurrMenu, setSearchString } from '../../../redux/atlas/atlas-slice';
import { useState } from 'react';

export default function SearchBar() {
    const dispatch = useDispatch();

    const [ searchValue, setSearchValue ] = useState('');
    const [ isFocus, setIsFocus ] = useState(false);

    const searchHandler = () => {
        dispatch(setSearchString(searchValue));
        dispatch(setCurrMenu('search'));
    };

    return (
        <div className="searchbar">
            <input placeholder='Поиск' value={ searchValue }
                onFocus={() => setIsFocus(true)}
                onChange={ (event) => {
                    setSearchValue(event.target.value);
                } }
                onKeyDown={(event) => {
                    if (isFocus && event.key === 'Enter') {
                        searchHandler();
                    }
                }}
            />
            <img src={divider} style={{ height: "46px" }} alt="divider" />
            <button className="searchButton" 
                onPointerDown={ searchHandler }
            >
                <img src={search} alt="search" />
            </button>
        </div>
    );
}