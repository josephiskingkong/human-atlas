export default function CloseMenuButton({ isMenuOpen, isInfoOpen, closeHandler }) {
    return (
        <button className={ (!isMenuOpen && !isInfoOpen) ? 'close-button' : 'close-button close-button-open' } 
            onClick={ closeHandler }
        ></button>
    );
}