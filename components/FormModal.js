import { useRouter } from "next/router"
import { useState } from "react";
import moment from "moment";
import "moment/locale/id";
import 'bootstrap-icons/font/bootstrap-icons.css';

// Framework functions
import { handleICSDownload } from "../framework-functions/ics_file";
import { addGuests, addNotifEmail, removeGuests } from "../framework-functions/guest_and_notification";
import { resetEvent, handleFinish } from "../framework-functions/finish_and_reset_form";

export default function FormModal(props) {
  const router = useRouter();

  const [tempEmailArray, setTempEmailArray] = useState([]);
  const [tempEmail, setTempEmail] = useState("");

  // Boolean for checking if user has finished filling the form 
  const [isFinished, setIsFinished] = useState(false);

  return (
    <>
      {/* <div onClick={props.isOCRResult ? null : () => resetEvent(props.setEventAttributes, setIsFinished, setTempEmailArray)}> */}
      <label htmlFor="my-modal" className="btn btn-primary modal-button w-fit m-auto">{props.label}</label>
      {/* </div> */}
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box max-w-[768px]">
          <div onClick={() => resetEvent(props.setEventAttributes, setIsFinished, setTempEmailArray, props.setOCRAttributes)}>
            <label htmlFor="my-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          </div>
          <form onSubmit={(e) => handleICSDownload(e, props.eventAttributes)} className="">
            <div className="flex md:flex-row flex-col gap-3">
              <div className="md:w-1/2">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-white">Judul Event</span>
                  </label>
                  {isFinished &&
                    <div className="mb-2 ml-2">
                      {props.eventAttributes.title}
                    </div>}
                  {!isFinished &&
                    <input
                      type="text"
                      value={props.eventAttributes.title}
                      onChange={(e) => props.setEventAttributes(eventAttributes => ({ ...eventAttributes, title: e.target.value }))}
                      placeholder="Judul Event"
                      className="input input-bordered w-full"
                    />
                  }
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-white">Deskripsi</span>
                  </label>
                  {isFinished &&
                    <div className="mb-2 ml-2">
                      {props.eventAttributes.description}
                    </div>}
                  {!isFinished &&
                    <input
                      type="text"
                      value={props.eventAttributes.description}
                      onChange={(e) => props.setEventAttributes(eventAttributes => ({ ...eventAttributes, description: e.target.value }))}
                      placeholder="Deskripsi"
                      className="input input-bordered w-full"
                    />
                  }
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-white">Waktu Mulai</span>
                  </label>
                  {isFinished &&
                    <div className="mb-2 ml-2">
                      {moment(props.eventAttributes.start).format('LLLL')}
                    </div>}
                  {!isFinished &&
                    <input
                      type="datetime-local"
                      value={props.eventAttributes.start}
                      onChange={(e) => {
                        props.setEventAttributes(eventAttributes => ({ ...eventAttributes, start: e.target.value }))
                      }}
                      placeholder="Waktu Mulai"
                      className="input input-bordered w-full"
                    />
                  }
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-white">Waktu Selesai</span>
                  </label>
                  {isFinished &&
                    <div className="mb-2 ml-2">
                      {moment(props.eventAttributes.end).format('LLLL')}
                    </div>}
                  {!isFinished &&
                    <input
                      type="datetime-local"
                      value={props.eventAttributes.end}
                      onChange={(e) => props.setEventAttributes(eventAttributes => ({ ...eventAttributes, end: e.target.value }))}
                      placeholder="Waktu Selesai"
                      className="input input-bordered bg- w-full"
                    />
                  }
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-white">Lokasi</span>
                  </label>
                  {isFinished &&
                    <div className="mb-2 ml-2">
                      {props.eventAttributes.location}
                    </div>}
                  {!isFinished &&
                    <input
                      type="text"
                      value={props.eventAttributes.location}
                      onChange={(e) => props.setEventAttributes(eventAttributes => ({ ...eventAttributes, location: e.target.value }))}
                      placeholder="Lokasi"
                      className="input input-bordered w-full"
                    />
                  }
                </div>
                <div className={`${router.pathname == "/dashboard" ? "block" : "hidden"}`}>
                  {!isFinished &&
                    <>
                      <div className="flex gap-3 items-center mt-3">
                        <p>Notifikasi</p>
                        <input
                          type="number"
                          value={props.eventAttributes.notif}
                          onChange={(e) => props.setEventAttributes(eventAttributes => ({
                            ...eventAttributes,
                            notif: e.target.value,
                          }))}
                          className="input input-bordered w-24 h-10"
                        />
                        <p>Menit</p>
                      </div>
                      <div className={`flex gap-3 items-center mt-3 ${props.eventAttributes.isNotifEmailEnabled ? "block" : "hidden"}`}>
                        <p>Email</p>
                        <input
                          type="number"
                          value={props.eventAttributes.notifEmail}
                          onChange={(e) => props.setEventAttributes(eventAttributes => ({
                            ...eventAttributes,
                            notifEmail: e.target.value,
                          }))}
                          className="input input-bordered w-24 h-10"
                        />
                        <p>Menit</p>
                      </div>
                      <button className={`btn mt-3 bg-white text-black ${props.eventAttributes.isNotifEmailEnabled ? "hidden" : "block"}`} onClick={(e) => addNotifEmail(e, props.setEventAttributes)}>
                        Tambahkan Notifikasi Email
                      </button>
                    </>
                  }
                  {isFinished &&
                    <div className="ml-1">
                      <div className="mt-3">
                        Notifikasi: {props.eventAttributes.notif} Menit
                      </div>
                      <div className={`${props.eventAttributes.isNotifEmailEnabled ? "block" : "hidden"}`}>
                        Notifikasi Email: {props.eventAttributes.notifEmail} Menit
                      </div>
                    </div>
                  }
                </div>
              </div>
              <div className={`form-control md:w-1/2 ${router.pathname == "/dashboard" ? "block" : "hidden"}`}>
                <label className="label">
                  <span className="label-text text-white">Tamu</span>
                </label>
                {isFinished &&
                  <>
                    {props.eventAttributes.emailArray?.map((res, index) => (
                      <div key={index} className="mb-2 ml-2">
                        {res.email}
                      </div>
                    ))
                    }
                  </>
                }
                {!isFinished &&
                  <>
                    <div className="relative">
                      <input
                        type="text"
                        value={tempEmail}
                        onChange={(e) => setTempEmail(e.target.value)}
                        placeholder="emailtamu@contoh.com"
                        className="input input-bordered w-full"
                      />
                      <button className="text-2xl flex items-center absolute right-3 top-0 bottom-0 hover:text-primary z-30" onClick={(e) => addGuests(e, tempEmail, setTempEmailArray, setTempEmail)}>
                        <i className="bi bi-plus-square-fill text-3xl"></i>
                      </button>
                    </div>
                    {tempEmailArray?.map((res, index) => (
                      <div key={index} className="relative">
                        <div className="hover:bg-slate-800 py-2 px-5">
                          {res.email}
                        </div>
                        <button className="text-2xl flex items-center absolute right-3 top-0 bottom-0 hover:text-primary z-30" onClick={(e) => removeGuests(e, res.email, setTempEmailArray, tempEmailArray)}>
                          <i className="bi bi-x-square-fill text-3xl"></i>
                        </button>
                      </div>
                    ))
                    }
                  </>
                }
              </div>
            </div>

            <button className={`btn btn-primary my-5 ${router.pathname == "/dashboard" ? "hidden" : "block"}`} type="submit">
              Download File iCalendar (.ics)
            </button>
            <div className={`${router.pathname == "/dashboard" ? "block" : "hidden"}`}>
              <button className={`btn btn-primary my-5 ${isFinished ? "hidden" : "block"}`} onClick={(e) => handleFinish(e, props.eventAttributes, props.setEventAttributes, setIsFinished, tempEmailArray)}>
                Selesai
              </button>
              <div className={`${isFinished ? "block" : "hidden"}`}>
                <button className={`btn btn-primary my-5 mr-3`} type="submit">
                  Download File iCalendar (.ics)
                </button>
                {!props.eventAttributes.eventHTMLLink &&
                  <button className={`btn btn-primary`} onClick={props.handleCreateEventOnGCal}>
                    Buat Event di Google Calendar
                  </button>
                }
                {props.eventAttributes.eventHTMLLink &&
                  <>
                    <div>
                      Event berhasil dibuat!
                    </div>
                    <a className={`btn btn-primary my-5`} href={props.eventAttributes.eventHTMLLink} target="_black">
                      Lihat Event di Google Calendar
                    </a>
                  </>
                }
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}