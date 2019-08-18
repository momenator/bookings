const moment = require('moment');

const formatBookings = (bookings) => bookings
  .map((bookingRecord) => ({
    time: moment(new Date(bookingRecord.time)),
    duration: bookingRecord.duration, // mins
    userId: bookingRecord.user_id,
  }));

/**
 * 
 * @param {start_time: Moment, end_time: Moment} duration 
 * @param [{start_time: Moment, end_time: Moment}, ...] durations 
 */
const checkDurationOverlap = (duration, durations) => {
  let overlap = false;
  for (d of durations) {
    overlap = (duration.start_time.isSameOrBefore(d.end_time) && duration.end_time.isSameOrAfter(d.start_time));
    
    const sameUser = duration.user_id === d.user_id;
    
    if (overlap && sameUser) {
      overlap = true;
      break;
    }
  }
  return overlap;
};

const formatBookingToDuration = (booking) => {
  const start_time = moment(new Date(booking.time));
  const end_time = moment(start_time).add(Number(booking.duration), 'minutes')
  return { 
    start_time, 
    end_time,
    user_id: booking.user_id,
  };
};

module.exports = {
  formatBookings,
  checkDurationOverlap,
  formatBookingToDuration,
};
