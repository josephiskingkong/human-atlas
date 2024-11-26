export default function CloseMenuButton({ currMenu, closeHandler }) {
    return (
        <button className={ currMenu === 'close' ? 'close-button' : 'close-button close-button-open' } 
            onClick={ closeHandler }
        ></button>
    );
}