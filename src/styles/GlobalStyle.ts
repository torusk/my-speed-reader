import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Yu Gothic', 'Hiragino Kaku Gothic Pro', 'Noto Sans JP', sans-serif;
    background-color: #fafafa;
    color: #333;
  }

  * {
    box-sizing: border-box;
  }
`;
