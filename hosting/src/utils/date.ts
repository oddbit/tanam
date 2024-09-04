/**
 * Format date based on a given format string
 * @param {Date} date - The date object to format
 * @param {string} format - The format string specifying the desired date format
 * @returns {string} The formatted date string based on the provided format
 */
export function formatDate(date: Date, format: string): string {
  const map: {[key: string]: string} = {
    YYYY: date.getFullYear().toString(),
    // Month as two digits
    MM: String(date.getMonth() + 1).padStart(2, "0"),
    // Day of the month as two digits
    DD: String(date.getDate()).padStart(2, "0"),
    // Hour (12-hour clock)
    hh: String(date.getHours() % 12 || 12).padStart(2, "0"),
    // Hour (24-hour clock)
    HH: String(date.getHours()).padStart(2, "0"),
    // Minutes as two digits
    mm: String(date.getMinutes()).padStart(2, "0"),
    // Seconds as two digits
    ss: String(date.getSeconds()).padStart(2, "0"),
    // AM/PM marker
    A: date.getHours() >= 12 ? "PM" : "AM",
    // am/pm marker
    a: date.getHours() >= 12 ? "pm" : "am",
    // Full month name
    MMMM: date.toLocaleString("default", {month: "long"}),
    // Short month name
    MMM: date.toLocaleString("default", {month: "short"}),
    // Full weekday name
    dddd: date.toLocaleString("default", {weekday: "long"}),
    // Short weekday name
    ddd: date.toLocaleString("default", {weekday: "short"}),
  };

  // Regex for AM/PM markers
  const amPmRegex = /A|a/g;
  // Regex for other tokens
  const otherTokensRegex = /MMMM|MMM|dddd|ddd|YYYY|MM|DD|hh|HH|mm|ss/g;

  // First replace the AM/PM markers
  let result = format.replace(amPmRegex, (matched) => map[matched] || matched);

  // Then replace the other tokens
  result = result.replace(otherTokensRegex, (matched) => map[matched] || matched);

  return result;
}

/**
 * Get the current date formatted based on a given format string
 * @param {string} format - The format string specifying the desired date format
 * @returns {string} The current date formatted based on the provided format
 */
export function getCurrentDateFormatted(format: string): string {
  return formatDate(new Date(), format);
}
