export default function Topic({ icon, title, description }) {
  return (
    <div className="topic">
      <div>
        <p className="topic-icon">{icon}</p>
        <p className="topic-title">{title}</p>
      </div>
      <p className="topic-description">{description}</p>
    </div>
  );
}
