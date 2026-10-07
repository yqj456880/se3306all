const posts = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `文章标题 ${i + 1}`,
  body: `这是第 ${i + 1} 篇文章的正文内容...`,
}));

const app = document.getElementById("app");

app.innerHTML =
  "<h1>文章列表</h1>" +
  posts
    .map(
      (p) => `<article>
        <h2>${p.title}</h2>
        <p>${p.body}</p>
      </article>`,
    )
    .join("");
