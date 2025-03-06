import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * Retrieves the formatted date string as a relative string or a traditional date format based on the time elapsed.
 *
 * @param {Date | string} date - The date to format.
 * @returns {string} The formatted date string representing the time elapsed or a traditional date.
 */
const formatRelativeOrAbsolute = (date: Date | string) => {
  const now = dayjs();
  const targetDate = dayjs(new Date(date));
  const diffInDays = now.diff(targetDate, "day");
  const diffInHours = now.diff(targetDate, "hour");
  const diffInMinutes = now.diff(targetDate, "minute");
  const diffInSeconds = now.diff(targetDate, "second");

  if (diffInDays >= 1) {
    // More than a day
    return diffInDays < 7
      ? `${diffInDays}d`
      : targetDate.format(
          now.year() === targetDate.year() ? "MMM D" : "MMM D, YYYY"
        );
  }

  if (diffInHours >= 1) {
    // More than an hour
    return `${diffInHours}h`;
  }

  if (diffInMinutes >= 1) {
    // More than a minute
    return `${diffInMinutes}m`;
  }

  // Seconds
  return `${diffInSeconds}s`;
};

export default formatRelativeOrAbsolute;
