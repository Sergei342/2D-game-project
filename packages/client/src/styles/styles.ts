import { createGlobalStyle } from 'styled-components'

import { cssVariables } from './variables'

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Russo One';
    src: url('/fonts/RussoOne-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Seymour One';
    src: url('/fonts/SeymourOne-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  :root {
    --text-color: ${cssVariables.textColor};
    --label-color: ${cssVariables.labelColor};
    --primary-color: ${cssVariables.primaryColor};
    --bg-color: ${cssVariables.bgColor};
    --placeholder: ${cssVariables.placeholder};
    --overlayColor: ${cssVariables.overlayColor};
    --errorColor: ${cssVariables.errorColor};
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    height: 100%;
    scrollbar-width: thin;
    scrollbar-color: ${cssVariables.primaryColor} transparent;
  }

  body {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: 'Russo One', 'Arial', -apple-system, sans-serif;
    background: var(--bg-color) url('/images/space-bg.png') center top / cover no-repeat;
    color: var(--text-color);
    overflow: hidden;
    image-rendering: pixelated;
  }

  #root {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 100vh;
    line-height: 1.14;
  }

    /* Неоновый glow */
  .arcade-glow {
    text-shadow:
      0 0 4px #00ff9c,
      0 0 8px #00ff9c;
  }

  /* Кнопки */
  .ant-btn-primary {
    box-shadow: 0 0 10px #00ff9c;
    text-transform: uppercase;
  }

  /* Инпуты */
  .ant-input,
  .ant-input-password {
    background-color: #05070d;
    box-shadow: inset 0 0 6px rgba(0, 255, 156, 0.4);
  }

  /* Скроллбар */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${cssVariables.primaryColor};
    border-radius: 3px;
    box-shadow: 0 0 4px ${cssVariables.primaryColor};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${cssVariables.secondaryColor};
    box-shadow: 0 0 6px ${cssVariables.secondaryColor};
  }

`
