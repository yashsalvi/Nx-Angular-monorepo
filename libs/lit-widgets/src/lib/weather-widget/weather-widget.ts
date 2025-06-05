import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { weatherWidgetStyles } from './weather-widget.styles';

@customElement('weather-widget')
export class WeatherWidget extends LitElement {
  @state() private temperature: string = '--';
  @state() private condition: string = 'Loading...';
  @state() private location: string = 'Your City';

  override connectedCallback(): void {
    super.connectedCallback();
    this.fetchWeather();
  }

  private async fetchWeather() {
    try {
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current_weather=true'
      );
      const data = await response.json();
      this.temperature = `${data.current_weather.temperature}°C`;
      this.condition = `${data.current_weather.weathercode}`;
      this.location = 'London';
    } catch (error) {
      console.error('Weather fetch failed:', error);
      this.condition = 'Error';
      this.temperature = '--';
    }
  }

  override render() {
    return html`
    <div class="weather-container">
    <div class="location">${this.location}</div>
    <div class="temperature">${this.temperature}</div>
    <div class="condition">${this.condition}</div>
  </div>
     `;
  }

  static override styles = weatherWidgetStyles;
}

if (!customElements.get('weather-widget')) {
  customElements.define('weather-widget', WeatherWidget);
}
