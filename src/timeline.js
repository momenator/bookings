import React from 'react';
import Timeline from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'


const BookingsTimeline = ({ users = [], bookings = [] }) => (
  <Timeline
    groups={users}
    items={bookings}
    defaultTimeStart={moment().add(-12, 'hours')}
    defaultTimeEnd={moment().add(12, 'hours')}
    stackItems={true}
  />
);

export default BookingsTimeline;
