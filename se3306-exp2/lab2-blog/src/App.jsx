import { useState } from "react";
import Header from "./Header";
import CategoryFilter from "./CategoryFilter";
import PostList from "./PostList";
import PostDetail from "./PostDetail";
import PostForm from "./PostForm";
import RemotePosts from "./RemotePosts"; // 稍后新建的 Query 演示组件
import { usePostStore } from "./usePostStore"; // 引入 Zustand
import "./App.css";

const CATEGORIES = ["全部", "技术", "随笔", "生活"];

export default function App() {
  // 使用 Zustand 精确取状态 (selector)
  const posts = usePostStore((s) => s.posts);
  const publish = usePostStore((s) => s.publish);
  const update = usePostStore((s) => s.update);
  const remove = usePostStore((s) => s.remove);

  const [currentCategory, setCurrentCategory] = useState("全部");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  
  // 切换本地博客 / 服务端 Query 演示的页签
  const [activeTab, setActiveTab] = useState("local"); 

  // 原有的增删改逻辑直接调用 Zustand 的方法
  function handleAddPost(draft) {
    publish(draft);
  }

  function handleUpdatePost(id, draft) {
    update(id, draft);
    setEditingPost(null);
  }

  function handleDeletePost(id) {
    if (window.confirm("确定要删除吗？")) {
      remove(id);
      if (selectedPostId === id) setSelectedPostId(null);
    }
  }

  const displayedPosts = currentCategory === "全部" 
    ? posts 
    : posts.filter(p => p.category === currentCategory);

  const selectedPost = posts.find(p => p.id === selectedPostId);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <Header title="我的博客" />
      
      {/* 页签切换 */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("local")} style={{ fontWeight: activeTab === "local" ? "bold" : "normal" }}>本地 Zustand 博客</button>
        <button onClick={() => setActiveTab("remote")} style={{ marginLeft: "10px", fontWeight: activeTab === "remote" ? "bold" : "normal" }}>服务端 Query 演示</button>
      </div>

      {activeTab === "local" ? (
        <>
          <CategoryFilter categories={CATEGORIES} current={currentCategory} onChange={setCurrentCategory} />
          <PostForm 
            initialData={editingPost} 
            onSubmit={editingPost ? (draft) => handleUpdatePost(editingPost.id, draft) : handleAddPost}
            onCancel={() => setEditingPost(null)}
          />
          <PostList 
            posts={displayedPosts} 
            onSelect={setSelectedPostId}
            onDelete={handleDeletePost}
            onEdit={setEditingPost}
          />
          <PostDetail post={selectedPost} onClose={() => setSelectedPostId(null)} />
        </>
      ) : (
        <RemotePosts />
      )}
    </div>
  );
}