AI 代码审查报告与 AI 使用声明 (ai-review.md)
〇、AI 使用声明
本实验在编写博客项目及基础训练代码时，使用了通义灵码/DeepSeek 辅助生成部分初始骨架代码。根据实验规范，AI 生成的代码均不能直接用于生产，必须由开发者审查。
以下为本人基于 React 官方文档对 AI 生成的博客组件代码进行的审查记录与整改对比。代码已实际运行并验证，审查留痕如下。

检查点 1：组件职责是否单一（代码行数 < 200 行）
AI 代码原文（问题片段）：AI 倾向于将文章状态管理、表单渲染、列表渲染、详情弹窗全部写在同一个 App.jsx 文件中，代码行数超过 300 行。

jsx
function App() {
const [posts, setPosts] = useState([]);
// ... 省略 50 行增删改查逻辑
// ... 省略 30 行表单受控逻辑
return (

<div>
{/_ 包含了 Header 的 JSX _/}
{/_ 包含了 PostForm 的 JSX _/}
{/_ 包含了 PostList 的 JSX _/}
</div>
)
}
违反的官方规则：违反了 React 官方文档《你的第一个组件》中提倡的“组件拆分原则”。组件超过 200 行会导致逻辑过于复杂，违反单一职责原则，难以复用和维护。

修改前后代码对比（diff 片段）：

diff

- // src/App.jsx (未拆分前)
- function App() {
- // 一堆状态和逻辑...
- }

* // src/App.jsx (拆分后)
* import Header from './Header';
* import PostForm from './PostForm';
* import PostList from './PostList';
* function App() {
* // 仅保留全局状态和组合逻辑
* return (
*     <>
*       <Header title="我的博客" />
*       <PostForm onSubmit={handleAddPost} />
*       <PostList posts={posts} />
*     </>
* )
* }
  修改后运行时行为的变化说明：拆分后，PostForm 内部的表单状态更新（如输入标题），只会触发 PostForm 及其子组件重渲染，不再触发整个 App 组件树的全体重渲染，页面输入响应速度明显变快。

检查点 2：Hook 调用顺序（不在 if / for / 嵌套函数中调用）
AI 代码原文（问题片段）：

jsx
if (isLoggedIn) {
const [user, setUser] = useState(null); // ❌ 错误：在条件语句中调用 Hook
}
违反的官方规则：React 官方《Hook 规则》——不要在循环、条件或嵌套函数中调用 Hook。React 内部是靠调用顺序来管理 Hook 的，如果写在 if 里，条件改变会导致 Hook 索引错位，必然崩溃。

修改前后代码对比（diff 片段）：

diff

- if (isLoggedIn) {
- const [user, setUser] = useState("张三");
- }

* // 无论是否登录，useState 必须无条件在顶层调用
* const [user, setUser] = useState("张三");
* // 在渲染 UI 时再判断条件
* const displayUser = isLoggedIn ? user : "未登录";
  修改后运行时行为的变化说明：修改前，点击“登录”按钮使 isLoggedIn 变为 true 时，页面直接白屏，控制台报错 Rendered more hooks than during the previous render.；修改后，Hook 顺序稳定，点击登录按钮正常切换状态，页面无报错。

检查点 3：依赖数组与闭包旧值（useEffect 依赖写全没）
AI 代码原文（问题片段）：

jsx
useEffect(() => {
const timer = setInterval(() => {
setCount(count + 1); // ❌ 闭包陷阱：count 捕获了初始值 0
}, 1000);
return () => clearInterval(timer);
}, []); // ❌ 空依赖，但使用了响应式变量 count
违反的官方规则：违反了官方文档《与 Effect 同步》中的依赖完整性原则。空依赖数组会导致 Effect 内部的闭包始终捕获最初渲染时的 count 值。

修改前后代码对比（diff 片段）：

diff
useEffect(() => {
const timer = setInterval(() => {

- setCount(count + 1);

* setCount(prev => prev + 1); // 函数式更新，不依赖外部 count 值
  }, 1000);
  return () => clearInterval(timer);
  }, []);
  修改后运行时行为的变化说明：修改前，页面的计数在变为 1 之后卡死不再增加（因为每次都是 0 + 1）；修改后，计数每秒正常递增 1、2、3...，定时器功能完美运行。

检查点 4：状态最小化（有没有冗余 state）
AI 代码原文（问题片段）：

jsx
const [posts, setPosts] = useState([]);
const [filteredPosts, setFilteredPosts] = useState([]); // ❌ 冗余，可通过 posts 算出
const [total, setTotal] = useState(0); // ❌ 冗余，等于 posts.length
违反的官方规则：违反了官方文档《选择 State 结构》——避免冗余 state。能用已有 state 或 props 计算出的数据，不应该作为新的 state，否则极易引起状态不同步的 Bug。

修改前后代码对比（diff 片段）：

diff
const [posts, setPosts] = useState([]);
const [currentCategory, setCurrentCategory] = useState("全部");

- const [filteredPosts, setFilteredPosts] = useState([]);
- const [total, setTotal] = useState(0);

* // 直接作为普通变量派生计算
* const filteredPosts = currentCategory === "全部"
* ? posts
* : posts.filter(p => p.category === currentCategory);
* const total = posts.length;
  修改后运行时行为的变化说明：修改前，新增文章后如果忘记调用 setTotal，页面底部的总数就不更新；修改后，只要 posts 或 currentCategory 发生改变，filteredPosts 和 total 在当次渲染中立刻自动重新计算，彻底消除了不同步的 Bug。

检查点 5：AI 生成代码是否附声明与审查留痕
AI 代码原文（问题片段）：AI 直接输出纯组件代码，没有任何关于“由 AI 生成”的注释说明。

违反的规则：未遵循实验要求的“AI使用规范”和“审查留痕”原则。

修改前后代码对比（diff 片段）：

diff

- /\*\*
- - 本组件初始骨架由 AI 辅助生成。
- - 已通过开发者对照官方文档审查并整改（详见仓库根目录 ai-review.md）。
- \*/
  import { useState } from 'react';
