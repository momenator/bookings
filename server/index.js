const express = require('express');
const cors = require('cors');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const parseCSV = require('./parseCSV');
const { 
  formatBookings,
  checkDurationOverlap,
  formatBookingToDuration
} = require('./util');
 
const app = express();
app.use(cors()); // so that app can access
app.use(fileUpload());

// store bookings in a variable
let bookings = JSON.parse(fs.readFileSync('./server/bookings.json'));

app.get('/bookings', (_, res, next) => {
  res.json(formatBookings(bookings));
});

app.post('/bookings', async (req, res) => {
  const files = req.files;
  
  await Promise.all(Object.keys(files).map(async (file) => {
    const bookingDurations = bookings.map(b => formatBookingToDuration(b))
    const bookingsToBeAdded = await parseCSV(files[file].data);
    const bookingsNoOverlap = bookingsToBeAdded.filter(b => {
      const currDur = formatBookingToDuration(b);
      const isOverlap = checkDurationOverlap(currDur, bookingDurations);
      return !isOverlap;
    });
    bookings = [ ...bookingsNoOverlap, ...bookings ];
  }));

  res.json(formatBookings(bookings));
});

app.listen(3001);
