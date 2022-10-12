/* eslint-disable react/no-children-prop */
import ICalendarLink from "react-icalendar-link";
import { Children, useEffect, useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";


export default function Main() {
  const [event, setEvent] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
  });
  const fileTypes = ["JPG", "PNG", "GIF"];
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
  };

  useEffect(() => {
    fetch(`http://dev-evetra.australiaeast.cloudapp.azure.com:8081/`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }, []);

  return (
    <div data-theme="dark">
      <div className="navbar bg-primary">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl text-white">EVETRA</a>
        </div>
        <div className="flex-none">
          <a className="btn btn-secondary">Masuk dengan Akun Google</a>
        </div>
      </div>
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
                <form>
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
                      value={event.startTime}
                      onChange={(e) => setEvent({
                        ...event,
                        startTime: e.target.value,
                      })}
                      placeholder="Waktu Mulai"
                      className="input input-bordered w-full max-w-xs"
                    />
                    {/* <div>{event.startTime}</div> */}
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-white">Waktu Selesai</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={event.endTime}
                      onChange={(e) => setEvent({
                        ...event,
                        endTime: e.target.value,
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
                </form>
                <div className="btn btn-primary my-5">
                  <ICalendarLink filename="myevent.ics" event={event}>
                    Download iCalendar (.ics) File
                  </ICalendarLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="footer footer-center p-10 bg-primary text-primary-content">
        <div>
          <svg width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" className="inline-block fill-current"><path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path></svg>
          <p className="font-bold">
            ACME Industries Ltd. <br />Providing reliable tech since 1992
          </p>
          <p>Copyright © 2022 - All right reserved</p>
        </div>
        <div>
          <div className="grid grid-flow-col gap-4">
            <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg></a>
            <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg></a>
            <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg></a>
          </div>
        </div>
      </footer>
    </div>
  )
}