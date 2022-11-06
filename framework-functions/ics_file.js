import axios from 'axios';
import PocketBase from 'pocketbase';

// connect to PocketBase SDK
const client = new PocketBase(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

// import .ics file generation module
const ics = require('ics')

// Function for download file
export function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob) // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

// Function for handling download ICS File
export const handleICSDownload = (e, eventAttributes) => {
  e.preventDefault();

  if (eventAttributes.title && eventAttributes.start && eventAttributes.end) {
    // Get users IPv4 address
    axios.get('https://geolocation-db.com/json/').then(function (result) {
      // Send users IPv4 address to database
      client.records.create('documents', { ip_address: result.data.IPv4 });
    })

    // Split string to array of string and then convert it to array of number
    const startArrayString = eventAttributes.start.split(/[-T:]/)
    const endArrayString = eventAttributes.end.split(/[-T:]/)
    const startArray = startArrayString.map(Number)
    const endArray = endArrayString.map(Number)

    // Create .ics file
    const eventFinal = {
      start: startArray,
      end: endArray,
      title: eventAttributes.title,
      description: eventAttributes.description,
      location: eventAttributes.location,
    }

    // Download .ics file
    ics.createEvent(eventFinal, (error, value) => {
      if (error) {
        console.log(error)
        return
      }
      download(value, `${eventAttributes.title}.ics`, "text/plain;charset=utf-8")
    })
  } else {
    alert("Judul, Waktu Mulai, dan Waktu Selesai wajib diisi")
  }
};