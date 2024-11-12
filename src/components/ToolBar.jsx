import '../styles/toolbar.css';

export default function ToolBar({ setToolState }) {
    const tools = ['arrow', 'add', 'pen', 'del'];

    return (
        <div className="toolbar">
            {tools.map((tool) => (
                <button key={tool} className={`${tool}-button`} onClick={() => setToolState(tool)}></button>
            ))}
        </div>
    );
}