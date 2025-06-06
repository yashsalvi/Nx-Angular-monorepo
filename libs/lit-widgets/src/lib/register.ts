import { ClockWidget } from './clock-widget/clock-widget';
import { WeatherWidget } from './weather-widget/weather-widget';

function registerCustomElement(tag: string, element: CustomElementConstructor) {
  if (!customElements.get(tag)) {
    customElements.define(tag, element);
  }
}

registerCustomElement('clock-widget', ClockWidget);
registerCustomElement('weather-widget', WeatherWidget);
