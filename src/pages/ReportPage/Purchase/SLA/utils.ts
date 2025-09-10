/**
 * Calculates the number of working days between two dates.
 *
 * @param {string | Date} startDate - The start date (inclusive). Recommended format: 'YYYY-MM-DD'.
 * @param {string | Date} endDate - The end date (inclusive). Recommended format: 'YYYY-MM-DD'.
 * @param {string[]} [holidays=[]] - An array of holiday dates in 'YYYY-MM-DD' format.
 * @param {number[]} [weekendDays=[6, 0]] - An array of day numbers representing the weekend (0=Sun, 1=Mon, ..., 6=Sat).
 * @returns {number} The total number of working days.
 */
export function getWorkingDays(
  startDate: string | Date,
  endDate: string | Date,
  holidays: string[] = [],
  weekendDays = [6, 0]
) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(0, 0, 0, 0);

  const holidaySet = new Set(holidays);
  const weekendSet = new Set(weekendDays);

  let workingDaysCount = 0;
  const currentDate = new Date(start.getTime());

  while (currentDate <= end) {
    const dayOfWeek = currentDate.getUTCDay();

    const formattedDate = currentDate.toISOString().slice(0, 10);
    const isWeekend = weekendSet.has(dayOfWeek);
    const isHoliday = holidaySet.has(formattedDate);

    if (!isWeekend && !isHoliday) {
      workingDaysCount++;
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return workingDaysCount;
}
