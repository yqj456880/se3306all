import PostItem from "./PostItem";

export default function PostList({ posts, onSelect, onDelete, onEdit }) {
  // 条件渲染：空态处理
  if (posts.length === 0) {
    return <p style={{ color: "#888" }}>还没有文章，写下第一篇吧</p>;
  }

  return (
    <div>
      {posts.map(post => (
        <PostItem
          key={post.id} // 核心：这里必须用 id 不能用 index
          post={post}
          onSelect={onSelect}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}