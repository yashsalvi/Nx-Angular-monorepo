export function describeCron(
  cron: string,
  startDateStr?: string,
  endDateStr?: string,
  options: { mode?: 'detailed' | 'human' } = { mode: 'detailed' }
): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 6) return 'Invalid cron expression';

  const [sec, min, hr, day, month, dow] = parts;
  const mode = options.mode ?? 'detailed';

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
 console.log(value)
    if (!isNaN(num) && min !== undefined && max !== undefined) {
      const isValid = num >= min && num <= max;

      if (range) {
        const rangeIndex = unit === 'month' ? num - 1 : num;
        const isInRange = unit === 'month' ? num >= 1 && num <= 12 : isValid;
   console.log(rangeIndex)
        return isInRange ? range[rangeIndex] : `Invalid ${unit}: ${num}`;
      }

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

  const isDefaultTime = sec === '0' && min === '0' && hr === '12';
  const isDaily = day === '*' && month === '*' && dow === '*';
const isWeekly = dow !== '*' && day === '*' && month === '*';
const isMonthlyOnWeekday = dow.includes('#') && day === '?' && month === '*';
  const isMonthly = day !== '*' && day !== '?' && month === '*';

  if (mode === 'human') {
    if (!isDefaultTime) {
      sentenceParts.push(`at ${hr.padStart(2, '0')}:${min.padStart(2, '0')}:${sec.padStart(2, '0')}`);
    }
 console.log(isDefaultTime)
    if (isDaily) {
      sentenceParts.push(`every day`);
    } else if (isWeekly) {
      sentenceParts.push(`every week on ${dowDesc}`);
    } else if (isMonthly) {
      sentenceParts.push(`every month on day ${day}`);
    } else if (isMonthlyOnWeekday) {
    const [dayNum, weekNum] = dow.split('#').map(Number);
    const weekNames = ['First', 'Second', 'Third', 'Fourth', 'Last'];
    const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    if (!isNaN(dayNum) && !isNaN(weekNum)) {
      const weekdayName = weekdayNames[dayNum] ?? `Invalid day (${dayNum})`;
      const weekLabel = weekNames[weekNum - 1] ?? `${weekNum}th`;
      sentenceParts.push(`every month on the ${weekLabel} ${weekdayName}`);
    } else {
      sentenceParts.push(`${secondsDesc}, ${minutesDesc}, ${hoursDesc}`);
    }
     console.log(weekNum)
  }
    else {
      sentenceParts.push(`${secondsDesc}, ${minutesDesc}, ${hoursDesc}`);
    }
  } else {
    sentenceParts.push(`${secondsDesc}, ${minutesDesc}, ${hoursDesc}`);

    if (dow !== '*' && dow !== '?') {
      sentenceParts.push(`on ${dowDesc}`);
    }

    const hasSpecificDay = day !== '*' && day !== '?';
    const hasSpecificMonth = month !== '*' && month !== '?';

    if (hasSpecificDay && hasSpecificMonth) {
      sentenceParts.push(`on day ${day} of ${monthDesc}`);
    } else if (hasSpecificDay) {
      sentenceParts.push(`on day ${day}`);
    } else if (hasSpecificMonth) {
      sentenceParts.push(`in ${monthDesc}`);
    }
  }

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
