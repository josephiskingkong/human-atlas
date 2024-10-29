export default function Menu({ title, content, closeMenuHandler }) {
    return (
        <>
            <button className="close-button" onClick={ closeMenuHandler }></button>
            <h1>{ title }</h1>
            <span>{ content }</span>
            <br />
            <button>OK</button>
        </>
    );
}