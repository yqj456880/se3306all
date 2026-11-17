import { create } from "zustand";
import { persist } from "zustand/middleware";

// 使用 persist 中间件包裹，自动同步到 localStorage
export const usePostStore = create(
  persist(
    (set) => ({
      posts: [],
      // 发布文章：使用 crypto.randomUUID() 生成唯一 id
      publish: (post) =>
        set((s) => ({
          posts: [
            {
              ...post,
              id: crypto.randomUUID(),
              publishedAt: new Date().toISOString().slice(0, 10),
            },
            ...s.posts,
          ],
        })),
      // 更新文章
      update: (id, patch) =>
        set((s) => ({
          posts: s.posts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      // 删除文章
      remove: (id) =>
        set((s) => ({
          posts: s.posts.filter((p) => p.id !== id),
        })),
    }),
    { name: "blog-store" }, // localStorage 的 key 名
  ),
);
