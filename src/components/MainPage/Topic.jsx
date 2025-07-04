export default function Topic({ icon, title, description }) {
  return (
    <a href="library">
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
