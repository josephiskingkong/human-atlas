export default function Menu({ content, closeMenuHandler }) {
    return (
        <>
            <button className="close-button" onClick={ closeMenuHandler }></button>
            <h1>Menu</h1>
            <span>{ content }</span>
            <br />
            <button>OK</button>
        </>
    );
}