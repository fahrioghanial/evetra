import { useRouter } from "next/router"
import moment from "moment";
import "moment/locale/id";
import { useState } from "react";

export default function FormModal(props) {
  const router = useRouter();

  return (
    <>
      <label htmlFor="my-modal" className="btn btn-primary modal-button w-fit m-auto" onClick={props.resetEvent}>{props.label}</label>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <label htmlFor="my-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <form onSubmit={props.handleSubmit}>
            <div className="flex md:flex-row flex-col gap-3">
              <div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-white">Judul Event</span>
                  </label>
                  {props.isFinished &&
                    <div className="mb-2 ml-2">
                      {props.title}
                    </div>}
                  {!props.isFinished &&
                    <input
                      type="text"
                      value={props.title}
                      onChange={(e) => props.setTitle(e.target.value)}
                      placeholder="Judul Event"
                      className="input input-bordered w-full max-w-xs"
                    />
                  }
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-white">Deskripsi</span>
                  </label>
                  {props.isFinished &&
                    <div className="mb-2 ml-2">
                      {props.description}
                    </div>}
                  {!props.isFinished &&
                    <input
                      type="text"
                      value={props.description}
                      onChange={(e) => props.setDescription(e.target.value)}
                      placeholder="Deskripsi"
                      className="input input-bordered w-full max-w-xs"
                    />
                  }
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-white">Waktu Mulai</span>
                  </label>
                  {props.isFinished &&
                    <div className="mb-2 ml-2">
                      {moment(props.start).format('LLLL')}
                    </div>}
                  {!props.isFinished &&
                    <input
                      type="datetime-local"
                      value={props.start}
                      onChange={(e) => {
                        props.setStart(e.target.value)
                      }}
                      placeholder="Waktu Mulai"
                      className="input input-bordered w-full max-w-xs"
                    />
                  }
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-white">Waktu Selesai</span>
                  </label>
                  {props.isFinished &&
                    <div className="mb-2 ml-2">
                      {moment(props.end).format('LLLL')}
                    </div>}
                  {!props.isFinished &&
                    <input
                      type="datetime-local"
                      value={props.end}
                      onChange={(e) => props.setEnd(e.target.value)}
                      placeholder="Waktu Selesai"
                      className="input input-bordered bg- w-full max-w-xs"
                    />
                  }
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-white">Lokasi</span>
                  </label>
                  {props.isFinished &&
                    <div className="mb-2 ml-2">
                      {props.location}
                    </div>}
                  {!props.isFinished &&
                    <input
                      type="text"
                      value={props.location}
                      onChange={(e) => props.setLocation(e.target.value)}
                      placeholder="Lokasi"
                      className="input input-bordered w-full max-w-xs"
                    />
                  }
                </div>
              </div>
              <div className={`form-control w-full ${router.pathname == "/dashboard" ? "block" : "hidden"}`}>
                <label className="label">
                  <span className="label-text text-white">Tambahkan Tamu</span>
                </label>
                {props.isFinished &&
                  <>
                    {props.emailArray?.map(res => (
                      <div key={res.email} className="mb-2 ml-2">
                        {res.email}
                      </div>
                    ))
                    }
                  </>
                }
                {!props.isFinished &&
                  <>
                    <input
                      type="text"
                      value={props.tempEmail}
                      onChange={(e) => props.setTempEmail(e.target.value)}
                      placeholder="emailtamu@contoh.com"
                      className="input input-bordered w-full max-w-xs"
                    />
                    <button className="btn btn-primary" onClick={props.addGuests}>
                      Tambah Tamu
                    </button>
                    {props.emailArray?.map(res => (
                      <div key={res.email}>
                        {res.email}
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
              <button className={`btn btn-primary my-5 ${props.isFinished ? "hidden" : "block"}`} onClick={props.handleFinish}>
                Selesai
              </button>
              <div className={`${props.isFinished ? "block" : "hidden"}`}>
                <button className={`btn btn-primary my-5`} type="submit">
                  Download File iCalendar (.ics)
                </button>
                {!props.eventHTMLLink &&
                  <button className={`btn btn-primary my-5`} onClick={props.handleCreateEventGCalClick}>
                    Buat Event di Google Calendar
                  </button>
                }
                {props.eventHTMLLink &&
                  <>
                    <div>
                      Event berhasil dibuat!
                    </div>
                    <a className={`btn btn-primary my-5`} href={props.eventHTMLLink} target="_black">
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