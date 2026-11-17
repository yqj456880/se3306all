export default function CategoryFilter({ categories, current, onChange }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <strong>分类过滤：</strong>
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          style={{
            margin: "0 5px",
            padding: "5px 10px",
            backgroundColor: current === cat ? "#007bff" : "#eee",
            color: current === cat ? "#fff" : "#000",
            border: "none",
            cursor: "pointer"
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}