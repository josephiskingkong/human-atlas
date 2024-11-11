import '../styles/toolbar.css';

export default function ToolBar({ setToolState }) {
    return (
        <div className="toolbar">
            <button className="arrow-button" onClick={ () => {
                setToolState('arrow');
            }}></button>
            <button className="add-button" onClick={ () => {
                setToolState('add');
                console.log('add');
            }}></button>
            <button className="pen-button" onClick={ () => {
                setToolState('pen');
                console.log('pen');
            }}></button>
            <button className="del-button" onClick={ () => {
                setToolState('del');
            }}></button>
        </div>
    );
}