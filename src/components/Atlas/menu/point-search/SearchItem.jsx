export default function SearchItem({ point }) {
    return (
        <div className="search-item">
            <h2 className="item-title">{ point.name }</h2>
            <p className="item-description">{ point.description }</p>
        </div>
    );
}