import CloseMenuButton from "./CloseMenuButton";
import SearchBar from "./SearchBar";

export default function InfoBar({ title, category, closeMenuHandler, isMenuOpen = true, isInfoOpen = true }) {
    return (
        <div className="info-bar-container">
            <SearchBar></SearchBar>
            { (isMenuOpen || isInfoOpen) && 
                <div className="info-container">
                    <div className="organ-title">
                        {title}
                    </div>
                    <div className="organ-category">
                        {category}
                    </div>
                </div> 
            }
        </div>
    );
}