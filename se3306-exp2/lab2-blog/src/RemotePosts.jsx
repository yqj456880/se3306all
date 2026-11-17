import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function RemotePosts() {
  const queryClient = useQueryClient();

  // 1. 查询：三态演示
  const { data: posts, isPending, isError, error } = useQuery({
    queryKey: ["remotePosts"],
    queryFn: () => fetch("http://localhost:3000/posts").then(r => r.json()),
  });

  // 2. 乐观更新（添加一条）
  const addPost = useMutation({
    mutationFn: (newPost) => fetch("http://localhost:3000/posts", {
      method: "POST", 
      body: JSON.stringify(newPost),
      headers: { "Content-Type": "application/json" },
    }).then(r => r.json()),
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ["remotePosts"] });
      const prev = queryClient.getQueryData(["remotePosts"]);
      // 秒出：直接插到最前面
      queryClient.setQueryData(["remotePosts"], old => [newPost, ...old]);
      return { prev };
    },
    onError: (err, newPost, context) => {
      queryClient.setQueryData(["remotePosts"], context.prev); // 失败回滚
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["remotePosts"] }); // 重新拉取
    },
  });

  if (isPending) return <p>加载中…（骨架屏位置）</p>;
  if (isError) return <p>出错了：{error.message}</p>;

  return (
    <div>
      <h3>来自本地 json-server 的数据 (TanStack Query)</h3>
      <button onClick={() => addPost.mutate({ title: "乐观更新的新文章", category: "测试", content: "123" })}>
        点我测试乐观更新
      </button>
      <ul>
        {posts.map(p => (
          <li key={p.id}>{p.title} - {p.category}</li>
        ))}
      </ul>
    </div>
  );
}