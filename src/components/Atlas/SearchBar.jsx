import divider from '../../assets/images/divider.svg';
import search from '../../assets/images/search.svg';

export default function SearchBar() {
    return (
        <div className="searchbar">
            <input placeholder='Поиск'/>
            <img src={divider} style={{ height: "46px" }} alt="divider" />
            <button className="searchButton"><img src={search} alt="search" /></button>
        </div>
    );
}