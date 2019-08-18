import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import moment from 'moment';
import BookingsTimeline from './timeline';
import './App.css';

const apiUrl = 'http://localhost:3001'

class App extends Component {

  state = {
    bookings: [],
    files: [],
  };

  componentWillMount() {
    fetch(`${apiUrl}/bookings`)
      .then((response) => response.json())
      .then((bookings) => {
        this.setState({ bookings })
      })
  }

  onDrop = (files) => {
    this.setState({ files: files });
  }

  uploadBookings = () => {
    const formData = new FormData();
    this.state.forEach((_, i) => {
      formData.append(`file${i}`, this.state.files[i]);
    });

    fetch(`${apiUrl}/bookings`, { method: 'POST', body: formData, })
      .then((response) => response.json())
      .then((bookings) => {
        this.setState({ bookings })
      });
  }

  renderFilesList = () => {
    return <div>
      { this.state.files.map((f, i) => <div key={i}>{f.name}</div>) }
    </div>
  }

  getUsers = () => {
    const userIds = new Set(this.state.bookings.map(b => b.userId));
    const users =  Array.from(userIds).map((id) => ({ id, title: id }))
    return users;
  }

  genRandomColor = () => {
    return [1,2,3].map(x => Math.random() * 256 | 0)
  }

  getBookingTimelines = () => {
    const colorMap = new Map();
    return this.state.bookings.map((b, i) => {
      if (!colorMap.get(b.userId)) {
        const color = this.genRandomColor();
        colorMap.set(b.userId, color);
      }

      return {
        id: i,
        group: b.userId,
        title: `Booking ${b.userId}`,
        start_time: moment(new Date(b.time)),
        end_time: moment(new Date(b.time)).add(b.duration, 'minutes'),
        itemProps: {
          style: {
            backgroundColor: `rgb(${colorMap.get(b.userId)})`,
            borderColor: 'white',
          }
        }
      }
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Dropzone
            accept=".csv"
            onDrop={this.onDrop}
          >
            Drag files here
          </Dropzone>
          <div>
            Files to upload:
            { this.renderFilesList() }
          </div>
          <button onClick={this.uploadBookings}>Upload</button>
        </div>
        <div className="App-main">
          <p>Existing bookings:</p>
          <BookingsTimeline
            users={this.getUsers()}
            bookings={this.getBookingTimelines()}
          />
        </div>
      </div>
    );
  }
}

export default App;
