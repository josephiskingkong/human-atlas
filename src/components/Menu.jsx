import SearchBar from "./SearchBar";

export default function Menu({ title, content, closeMenuHandler }) {
    return (
        <>
            <SearchBar></SearchBar>
            <div className="menu">
                <div className="menu-content">
                    <div className="title-container">
                        <h1 className="style-text">{ title }</h1>
                        <button className="close-button" onClick={ closeMenuHandler }></button>
                    </div>
                    <pre className="style-text">{ content }</pre>
                    <br />
                </div>
            </div>
        </>
    );
}