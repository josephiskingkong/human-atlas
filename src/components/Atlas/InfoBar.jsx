import SearchBar from "./SearchBar";

export default function InfoBar({ title, category, closeMenuHandler, isOpen = true }) {
    return (
        <div className="info-bar-container">
            <SearchBar></SearchBar>
            { isOpen && <div className="info-container">
                <div className="organ-title">
                    {title}
                </div>
                <div className="organ-category">
                    {category}
                </div>
            </div> }
        </div>
    );
}