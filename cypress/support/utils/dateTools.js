import moment from 'moment';

export default {
  getCurrentDate: () => {
    return moment.utc().format('MM/DD/YYYY');
  },

  getDateAfter: (date) => {
    return moment.utc(date).add(1, 'day').format('MM/DD/YYYY');
  },

  getDateBefore: (date) => {
    return moment.utc(date).add(-1, 'day').format('MM/DD/YYYY');
  },

  getApiDate: (date) => {
    return moment.utc(date).format('YYYY-MM-DD');
  },

  getDateNoZeros(date) {
    return moment.utc(date).format('M/D/YYYY');
  },

  getFormattedDateWithTime(date) {
    return moment.utc(date).format('M/D/YYYY h:mm A');
  },
};
