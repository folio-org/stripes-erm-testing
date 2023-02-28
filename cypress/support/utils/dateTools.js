import moment from 'moment';

export default {
  getCurrentDate: () => {
    return moment.utc().format('MM/DD/YYYY');
    // moment().format("YYYY-MM-DD")
  },

  getDateNoZeros(date) {
    console.log('moment ', moment.utc(date).format('M/D/YYYY'));
    console.log('moment empty utc', moment.utc().format('M/D/YYYY'));
    return moment.utc(date).format('M/D/YYYY');
  },

  getFormattedDateWithTime(date) {
    return moment.utc(date).format('M/D/YYYY, h:mm A');
  },
};
