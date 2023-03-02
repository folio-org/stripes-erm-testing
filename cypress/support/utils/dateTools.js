import moment from 'moment';

export default {
  getCurrentDate: () => {
    return moment.utc().format('MM/DD/YYYY');
  },

  getDateNoZeros(date) {
    return moment.utc(date).format('M/D/YYYY');
  },

  getFormattedDateWithTime(date) {
    return moment.utc(date).format('M/D/YYYY h:mm A');
  },
};
