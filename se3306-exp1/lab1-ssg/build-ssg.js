const fs = require("fs");

const posts = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `文章标题 ${i + 1}`,
  body: `这是第 ${i + 1} 篇文章的正文内容...`,
}));

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SSG 文章列表</title>
</head>
<body>
  <h1>文章列表</h1>
  ${posts
    .map(
      (p) => `<article>
        <h2>${p.title}</h2>
        <p>${p.body}</p>
      </article>`,
    )
    .join("")}
</body>
</html>`;

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/index.html", html);

console.log("静态页面已生成到 dist/");
