/* eslint-disable react/no-children-prop */
import { useEffect, useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import axios from 'axios';
import PocketBase from 'pocketbase';
import Navbar from "../components/navbar";
import HeadTitle from "../components/headTitle";
import Footer from "../components/footer";

const ics = require('ics')
const client = new PocketBase(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

export default function Main() {
  const [event, setEvent] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    location: "",
  });
  const fileTypes = ["JPG", "PNG", "GIF"];
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
  };

  useEffect(() => {

  }, []);

  function download(data, filename, type) {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (event.title && event.start && event.end) {


      // Get users IPv4 address
      axios.get('https://geolocation-db.com/json/').then(function (result) {
        // Send users IPv4 address to database
        client.records.create('documents', { ip_address: result.data.IPv4 });
      })

      // Split string to array of string and then convert it to array of number
      const startArrayString = event.start.split(/[-T:]/)
      const endArrayString = event.end.split(/[-T:]/)
      const startArray = startArrayString.map(Number)
      const endArray = endArrayString.map(Number)

      // Create .ics file
      const eventFinal = {
        start: startArray,
        end: endArray,
        title: event.title,
        description: event.description,
        location: event.location,
      }

      ics.createEvent(eventFinal, (error, value) => {
        if (error) {
          console.log(error)
          return
        }
        download(value, `${event.title}.ics`, "text/plain;charset=utf-8")
      })
    } else {
      alert("Judul, Waktu Mulai, dan Waktu Selesai wajib diisi")
    }
  };

  return (
    <div data-theme="dark" id="app">
      <HeadTitle />
      <Navbar />
      <section id="home" className="mt-5">
        <div className="container m-auto p-5 text-white">
          <div className="flex flex-col gap-3 w-3/4 m-auto text-center">
            <img className="w-1/5 m-auto" src="https://img.freepik.com/premium-vector/boutique-dress-mannequin-with-hat-logo-design-vector-graphic-symbol-icon-sign-illustration-creative_15473-10114.jpg?w=2000" alt="" />
            <p className="text-5xl font-bold">Evetra (Event Extractor)</p>
            <p className="text-xl font-normal">Platform yang memudahkanmu untuk menyimpan dan membuat pengingat terhadap agenda dari surat undanganmu, secara cepat, tanpa repot, dan tanpa biaya.</p>
          </div>
          <div className="w-5/6 my-10 m-auto">
            <FileUploader handleChange={handleChange} name="file" types={fileTypes} label="upload sini"
              children={
                <>
                  <div
                    className="flex justify-center w-full h-60 p-10 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none flex-col">
                    <a className="btn btn-primary w-fit m-auto">Unggah Dokumen Undangan</a>
                    <span className="flex items-center space-x-2 m-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="font-medium text-white">
                        Atau drop file disini
                      </span>
                    </span>
                    <p>{file ? `Nama File: ${file.name}` : ""}</p>
                  </div>
                </>
              }
            />
          </div>

          <div className="w-fit m-auto my-10">
            <label htmlFor="my-modal" className="btn btn-primary modal-button w-fit m-auto">Buat Event Manual</label>
            <input type="checkbox" id="my-modal" className="modal-toggle" />
            <div className="modal">
              <div className="modal-box">
                <label htmlFor="my-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                <form onSubmit={handleSubmit}>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-white">Judul Event</span>
                    </label>
                    <input
                      type="text"
                      value={event.title}
                      onChange={(e) => setEvent({
                        ...event,
                        title: e.target.value,
                      })}
                      placeholder="Judul Event"
                      className="input input-bordered w-full max-w-xs"
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-white">Deskripsi</span>
                    </label>
                    <input
                      type="text"
                      value={event.description}
                      onChange={(e) => setEvent({
                        ...event,
                        description: e.target.value,
                      })}
                      placeholder="Deskripsi"
                      className="input input-bordered w-full max-w-xs"
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-white">Waktu Mulai</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={event.start}
                      onChange={(e) => setEvent({
                        ...event,
                        start: e.target.value,
                      })}
                      placeholder="Waktu Mulai"
                      className="input input-bordered w-full max-w-xs"
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-white">Waktu Selesai</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={event.end}
                      onChange={(e) => setEvent({
                        ...event,
                        end: e.target.value,
                      })}
                      placeholder="Waktu Selesai"
                      className="input input-bordered bg- w-full max-w-xs"
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-white">Lokasi</span>
                    </label>
                    <input
                      type="text"
                      value={event.location}
                      onChange={(e) => setEvent({
                        ...event,
                        location: e.target.value,
                      })}
                      placeholder="Lokasi"
                      className="input input-bordered w-full max-w-xs"
                    />
                  </div>
                  <button className="btn btn-primary my-5" type="submit">
                    Download iCalendar (.ics) File
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}