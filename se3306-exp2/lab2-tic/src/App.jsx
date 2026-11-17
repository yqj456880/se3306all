import { useWindowSize } from './useWindowSize';

export default function App() {
  const { width, height } = useWindowSize();

  return (
    <div>
      <h1>自定义 Hook 练习</h1>
      <p>当前窗口宽度: {width} px</p>
      <p>当前窗口高度: {height} px</p>
    </div>
  );
}