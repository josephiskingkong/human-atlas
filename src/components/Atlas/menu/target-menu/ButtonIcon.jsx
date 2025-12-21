export default function ButtonIcon({ children, alt, isActive, onClick }) {
    return (
        <button onClick={ onClick }  className={ isActive ? "button-markdown" : "button-markdown button-active" }>
            <img src={ children } alt={ alt }/>
        </button>
    )
}