export function describeCron(cron: string, startDateStr?: string, endDateStr?: string): string {
  const parts = cron.trim().split(/\s+/);
  console.log(parts)
  if (parts.length !== 6) return 'Invalid cron expression';
  debugger
  const [sec, min, hr, day, month, dow] = parts;

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatField = (
    value: string,
    unit: string,
    range?: string[],
    minRange?: number,
    maxRange?: number
  ): string => {
    if (value === '*') return `every ${unit}`;
console.log(maxRange)
    if (value.includes(',')) {
      return value.split(',').map(v => formatSingleValue(v, unit, range, minRange, maxRange)).join(', ');
    }

    if (value.includes('/')) {
      const step = value.split('/')[1];
      return `every ${step} ${unit}${+step > 1 ? 's' : ''}`;
    }
console.log(value)
    if (value.includes('-')) {
      const [start, end] = value.split('-').map(Number);
      const startFormatted = formatSingleValue(start.toString(), unit, range, minRange, maxRange);
      const endFormatted = formatSingleValue(end.toString(), unit, range, minRange, maxRange);
      return `${startFormatted} to ${endFormatted}`;
    }
    return formatSingleValue(value, unit, range, minRange, maxRange);
  };

const formatSingleValue = (
  value: string,
  unit: string,
  range?: string[],
  min?: number,
  max?: number
): string => {
  const num = parseInt(value, 10);
console.log(num)
  if (!isNaN(num) && min !== undefined && max !== undefined) {
    const isValid = num >= min && num <= max;

    if (range) {
      const rangeIndex = unit === 'month' ? num - 1 : num;
      const isInRange = unit === 'month' ? num >= 1 && num <= 12 : isValid;

      return isInRange ? range[rangeIndex] : `Invalid ${unit}: ${num}`;
    }
console.log(range)
    return isValid ? `${unit} ${num}` : `Invalid ${unit}: ${num}`;
  }

  return `${unit} ${value}`;
};


  const secondsDesc = formatField(sec, 'second', undefined, 0, 59);
  const minutesDesc = formatField(min, 'minute', undefined, 0, 59);
  const hoursDesc = formatField(hr, 'hour', undefined, 0, 23);
  const dayDesc = formatField(day, 'day', undefined, 1, 31);
  const monthDesc = formatField(month, 'month', monthNames, 1, 12);
  const dowDesc = formatField(dow, 'day of week', dayNames, 0, 6);

  let sentenceParts: string[] = [];

  if (min.startsWith('*/') && hr === '*' && day === '*' && month === '*' && dow === '*') {
    sentenceParts.push(`Every ${min.slice(2)} minutes`);
  } else if (hr !== '*' && min !== '*' && dow === '*' && day === '*' && month === '*') {
    sentenceParts.push(`At ${hr.padStart(2, '0')}:${min.padStart(2, '0')}`);
  } else {
    sentenceParts.push(`${secondsDesc}, ${minutesDesc}, ${hoursDesc}`);
  }

  if (dow !== '*' && dow !== '?') {
    sentenceParts.push(`on ${dowDesc}`);
  }

  const hasSpecificDay = day !== '*' && day !== '?';
  const hasSpecificMonth = month !== '*' && month !== '?';
console.log(hasSpecificMonth)
  if (hasSpecificDay && hasSpecificMonth) {
    sentenceParts.push(`on day ${day} of ${monthDesc}`);
  } else if (hasSpecificDay) {
    sentenceParts.push(`on day ${day}`);
  } else if (hasSpecificMonth) {
    sentenceParts.push(`in ${monthDesc}`);
  }
console.log(sentenceParts)
  if (startDateStr) {
    const start = new Date(startDateStr);
    sentenceParts.push(`starting ${start.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}`);
  }

  if (endDateStr) {
    const end = new Date(endDateStr);
    sentenceParts.push(`until ${end.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}`);
  }
console.log(sentenceParts)
  const sentence = sentenceParts.join(' ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}
