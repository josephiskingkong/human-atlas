export default function Topic({ id, icon, title, description }) {
  return (
    <a href={`library?category=${id}`}>
      <div className="topic">
        <div>
          <p className="topic-icon">{icon}</p>
          <p className="topic-title">{title}</p>
        </div>
        <p className="topic-description">{description}</p>
      </div>
    </a>
  );
}
