import SearchBar from "./SearchBar";

export default function Menu({ title, content, closeMenuHandler }) {
    return (
        <>
            <SearchBar></SearchBar>
            <div className="menu">
                <button className="close-button" onClick={ closeMenuHandler }></button>
                <h1>{ title }</h1>
                <span>{ content }</span>
                <br />
            </div>
        </>
    );
}