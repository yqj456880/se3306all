export default function PostDetail({ post, onClose }) {
  if (!post) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "8px", width: "500px", maxWidth: "90%" }}>
        <h2>{post.title}</h2>
        <p style={{ color: "#888" }}>{post.category} | {post.publishedAt}</p>
        <hr />
        <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>
        <button onClick={onClose} style={{ marginTop: "20px", padding: "8px 16px" }}>关闭</button>
      </div>
    </div>
  );
}