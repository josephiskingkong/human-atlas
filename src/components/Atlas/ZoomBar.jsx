export default function ZoomBar() {
    return (
        <div className='zoombar float-menu-button'>
            <button id='zoom-in' className='zoom-buttons'>+</button>
            <button style={{ fontWeight: 900 }} id='zoom-out' className='zoom-buttons'>–</button>
        </div>
    );
}