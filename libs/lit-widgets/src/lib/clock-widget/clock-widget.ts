import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { clockWidgetStyles } from './clock-widget.styles';

@customElement('clock-widget')
export class ClockWidget extends LitElement {
  @state() 
  private currentTime: string = this.getTime();
 private currentDate: string = this.getDate();
  private timerId: number | undefined;

  override connectedCallback(): void {
    super.connectedCallback();
    this.timerId = window.setInterval(() => {
      this.currentTime = this.getTime();
       this.currentDate = this.getDate();
    }, 1000);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  private getTime(): string {
    return new Date().toLocaleTimeString();
  }

  private getDate(): string {
    return new Date().toLocaleDateString();
  }

  override render() {
    return html`
      <div class="clock-container">
        <div class="label">Today is</div>
        <div class="date">${this.currentDate}</div>
        <div class="label">Current Time</div>
        <div class="clock">${this.currentTime}</div>
      </div>
    `;
  }

  static override styles = clockWidgetStyles;
}