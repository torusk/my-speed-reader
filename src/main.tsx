import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx"; // App.tsx をインポート
// GlobalStyle は App.tsx 内で読み込まれるので、ここでは不要な場合が多い
// import { GlobalStyle } from './GlobalStyle.ts' // もしApp.tsx外で適用したい場合は追記

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <GlobalStyle /> */} {/* App.tsx内で適用しているので通常は不要 */}
    <App />
  </React.StrictMode>
);
