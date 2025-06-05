import { css } from 'lit';

export const weatherWidgetStyles = css`
  .weather-container {
    font-family: 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #2193b0, #6dd5ed);
    color: #fff;
    padding: 1.5rem;
    border-radius: 12px;
    width: 220px;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }

  .location {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .temperature {
    font-size: 2.2rem;
    font-weight: 600;
    margin: 0.5rem 0;
  }

  .condition {
    font-size: 1rem;
    font-style: italic;
    color: #d1ecf1;
  }
`;
