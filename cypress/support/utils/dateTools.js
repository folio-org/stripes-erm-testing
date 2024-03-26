import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export default {
  getCurrentDate: () => {
    return dayjs.utc().format('MM/DD/YYYY');
  },

  // do not use utc in the following date formatters w/o time
  // as it will cause the date to be off by one day

  getDateAfter: (date) => {
    return dayjs(date).add(1, 'day').format('MM/DD/YYYY');
  },

  getDateBefore: (date) => {
    return dayjs(date).add(-1, 'day').format('MM/DD/YYYY');
  },

  getApiDate: (date) => {
    return dayjs(date).format('YYYY-MM-DD');
  },

  getDateNoZeros: (date) => {
    return dayjs(date).format('M/D/YYYY');
  },

  getFormattedDateWithTime: (date) => {
    return dayjs.utc(date).format('M/D/YYYY h:mm A');
  },
};
