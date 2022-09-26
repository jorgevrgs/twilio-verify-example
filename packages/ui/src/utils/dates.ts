import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const timeInXMinutes = (time: string | Date, minutes: number = 10) => {
  return dayjs(time).add(minutes, 'minute');
};

export const getSecondsToExpire = (expireDate: string | Date) => {
  const timeInTenMinutes = timeInXMinutes(expireDate);
  const now = dayjs();
  const diffInSeconds = timeInTenMinutes.diff(now, 'second');

  return diffInSeconds <= 0 ? 0 : diffInSeconds;
};
