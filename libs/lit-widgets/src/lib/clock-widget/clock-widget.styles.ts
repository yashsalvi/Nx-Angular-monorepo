import { css } from 'lit';

export const clockWidgetStyles = css`
  .clock-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #1d3557, #457b9d);
    color: #f1faee;
    padding: 1.5rem;
    border-radius: 12px;
    width: 250px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    text-align: center;
  }

  .label {
    font-size: 0.9rem;
    color: #a8dadc;
    margin-bottom: 0.3rem;
  }

  .clock {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .date {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
`;
