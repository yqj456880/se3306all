export default function PostItem({ post, onSelect, onDelete, onEdit }) {
  // 条件渲染：无摘要文章显示内容前60字
  const displaySummary = post.summary || (post.content ? post.content.slice(0, 60) + "..." : "无内容");

  return (
    <div style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "10px", borderRadius: "5px" }}>
      <h3 onClick={() => onSelect(post.id)} style={{ cursor: "pointer", margin: "0 0 10px 0", color: "#007bff" }}>
        {post.title}
      </h3>
      <span style={{ backgroundColor: "#e0e0e0", padding: "2px 6px", borderRadius: "3px", fontSize: "12px" }}>
        {post.category}
      </span>
      <span style={{ marginLeft: "10px", color: "#888", fontSize: "12px" }}>{post.publishedAt}</span>
      <p style={{ marginTop: "10px" }}>{displaySummary}</p>
      <div>
        <button onClick={() => onEdit(post)} style={{ marginRight: "10px" }}>编辑</button>
        <button onClick={() => onDelete(post.id)} style={{ color: "red" }}>删除</button>
      </div>
    </div>
  );
}