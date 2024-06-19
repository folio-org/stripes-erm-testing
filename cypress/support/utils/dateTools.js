import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export default {
  getCurrentDate: () => {
    return dayjs.utc().format('MM/DD/YYYY');
  },

  getDateAfter: (date) => {
    return dayjs.utc(date).add(1, 'day').format('MM/DD/YYYY');
  },

  getDateBefore: (date) => {
    return dayjs.utc(date).add(-1, 'day').format('MM/DD/YYYY');
  },

  getApiDate: (date) => {
    return dayjs.utc(date).format('YYYY-MM-DD');
  },

  getDateNoZeros: (date) => {
    return dayjs(date).format('M/D/YYYY');
  },

  getFormattedDateWithTime: (date) => {
    return dayjs.utc(date).format('M/D/YYYY h:mm A');
  },
};
