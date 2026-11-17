import { useState } from "react";

export default function PostForm({ initialData, onSubmit, onCancel }) {
  // 受控表单：状态提升到表单组件内部
  const [draft, setDraft] = useState(
    initialData || { title: "", category: "技术", summary: "", content: "" }
  );

  function handleSubmit(e) {
    e.preventDefault(); // 阻止默认刷新
    if (!draft.title.trim() || !draft.content.trim()) {
      alert("标题和正文不能为空");
      return;
    }
    onSubmit(draft);
    // 如果是新建，提交后清空表单
    if (!initialData) {
      setDraft({ title: "", category: "技术", summary: "", content: "" });
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: "#f9f9f9", padding: "15px", marginBottom: "20px", borderRadius: "5px" }}>
      <h3>{initialData ? "编辑文章" : "写新文章"}</h3>
      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="文章标题"
          value={draft.title}
          onChange={e => setDraft({ ...draft, title: e.target.value })}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <select
          value={draft.category}
          onChange={e => setDraft({ ...draft, category: e.target.value })}
          style={{ padding: "8px" }}
        >
          <option value="技术">技术</option>
          <option value="随笔">随笔</option>
          <option value="生活">生活</option>
        </select>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="摘要（可选）"
          value={draft.summary}
          onChange={e => setDraft({ ...draft, summary: e.target.value })}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <textarea
          placeholder="正文内容"
          value={draft.content}
          onChange={e => setDraft({ ...draft, content: e.target.value })}
          rows={4}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>
      <button type="submit" style={{ padding: "8px 16px", marginRight: "10px" }}>提交</button>
      {initialData && <button type="button" onClick={onCancel} style={{ padding: "8px 16px" }}>取消</button>}
    </form>
  );
}