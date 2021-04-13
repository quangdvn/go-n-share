import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export function isDayBetween(
  curDate: string | dayjs.Dayjs,
  startDate: string,
  endDate: string,
) {
  const boolean = dayjs(curDate, 'YYYY/MM/DD').isBetween(
    startDate,
    endDate,
    null,
    '[]',
  );
  return boolean;
}
