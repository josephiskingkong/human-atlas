import SearchBar from "./SearchBar";

export default function InfoBar({ title, category, currMenu, closeButton }) {
    return (
        <div className="info-bar-container">
            { closeButton }
            <SearchBar></SearchBar>
            { currMenu !== 'close' && 
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