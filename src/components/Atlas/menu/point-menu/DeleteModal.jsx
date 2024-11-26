import "../../../../styles/components/del-modal.css"

export default function DeleteModal({ close, del }) {
    return (
        <>
            <div className="blur"></div>
            <div className="modal-content">
                <p className="modal-text">Вы уверены, что хотите удалить эту точку?</p>
                <div className="buttons-container">
                    <button className="button-yes" onClick={ () => { del(); close(); } }>Да</button>
                    <button className="button-no" onClick={ close }>Нет</button>
                </div>
            </div>
        </>
    );
}