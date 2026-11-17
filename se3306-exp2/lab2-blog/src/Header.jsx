export default function Header({ title }) {
  return (
    <header style={{ borderBottom: "2px solid #000", paddingBottom: "10px", marginBottom: "20px" }}>
      <h1>{title}</h1>
    </header>
  );
}