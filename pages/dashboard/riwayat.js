/* eslint-disable react/no-children-prop */
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import "moment/locale/id";
import axios from "axios";
import PocketBase from "pocketbase";

// Components
import DragDropUpload from "../../components/DragDropUpload";
import FormModal from "../../components/FormModal";

// Layout
import DashboardLayout from "../../layouts/DashboardLayout";
import { useRouter } from "next/router";
import { handleCreateEventOnGCal } from "../../framework-functions/gcalendar";
import { handleICSDownload } from "../../framework-functions/ics_file";

// connect to PocketBase SDK
const client = new PocketBase(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

export default function Riwayat() {
  const [eventHistory, setEventHistory] = useState([]);
  const [eventDetail, setEventDetail] = useState({});
  const router = useRouter();

  function handleSetEventDetail(res) {
    setEventDetail(res);
  }

  function handleICS(e, res) {
    e.preventDefault();
    handleICSDownload(e, res);
  }

  function handleGCal(e, res) {
    e.preventDefault()
    const event = {
      'summary': res.title,
      'location': res.location,
      'description': res.description,
      'start': {
        'dateTime': res.start + ":00",
        'timeZone': 'Asia/Jakarta'
      },
      'end': {
        'dateTime': res.end + ":00",
        'timeZone': 'Asia/Jakarta'
      },
      'attendees': res.attendees,
      'reminders': {
        'useDefault': false,
        'overrides': res.reminder_minutes
      }
    };

    try {
      const request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        // 'sendUpdates': 'all',
        'resource': event,
      });

      request.execute(function (event) {
        const data = {
          event_id_on_gcal: event.id,
          event_link_on_gcal: event.htmlLink
        };
        // console.log(event)
        const request2 = client.records.update('event_history', res.id, data)
        request2.then((res) => {
          const record = client.records.getFullList("event_history", 200, {
            sort: "-created",
            filter: `user = "${localStorage.getItem("email")}"`,
            $autoCancel: false,
          });
          record
            .then((result) => {
              // console.log(result);
              setEventHistory(result);
            })
            .catch((err) => {
              // console.log(err);
              // console.log(err.isAbort); // true
            });
        })
      });
    } catch (err) {
      // console.error(err)
      return;
    }
  }

  async function handleDelete(e, record_id, event_id_on_gcal) {
    e.preventDefault();
    if (
      event_id_on_gcal
        ? confirm(
          "Hapus Riwayat Event (Event akan terhapus juga pada Google Calendar)?"
        )
        : confirm("Hapus Riwayat Event?")
    ) {
      if (event_id_on_gcal) {
        gapi.client
          .request({
            path: `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event_id_on_gcal}`,
            method: "DELETE",
          })
          .then((res) => {
            // console.log(res);
          });
      }
      await client.records.delete("event_history", record_id);
      const record = client.records.getFullList("event_history", 200, {
        sort: "-created",
        filter: `user = "${localStorage.getItem("email")}"`,
        $autoCancel: false,
      });
      record
        .then((result) => {
          // console.log(result);
          setEventHistory(result);
        })
        .catch((err) => {
          // console.log(err);
          // console.log(err.isAbort); // true
        });
    }
  }

  useEffect(() => {
    const record = client.records.getFullList("event_history", 200, {
      sort: "-created",
      filter: `user = "${localStorage.getItem("email")}"`,
      $autoCancel: false,
    });
    record
      .then((result) => {
        // console.log(result);
        setEventHistory(result);
      })
      .catch((err) => {
        // console.log(err);
        // console.log(err.isAbort); // true
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <DashboardLayout title="Profil">
        <section id="home" className="my-4">
          <input type="checkbox" id="my-modal-3" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box max-w-[768px]">
              <div>
                <label
                  htmlFor="my-modal-3"
                  className="btn btn-sm btn-circle absolute right-2 top-2"
                >
                  ✕
                </label>
              </div>
              <form>
                <div className="flex md:flex-row flex-col gap-3">
                  <div className="md:w-1/2">
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text text-white">
                          Judul Event
                        </span>
                      </label>
                      <input
                        type="text"
                        value={eventDetail.title}
                        readOnly
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text text-white">Deskripsi</span>
                      </label>
                      <input
                        type="text"
                        value={eventDetail.description}
                        readOnly
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text text-white">
                          Waktu Mulai
                        </span>
                      </label>
                      <input
                        type="datetime-local"
                        value={eventDetail.start}
                        readOnly
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text text-white">
                          Waktu Selesai
                        </span>
                      </label>
                      <input
                        type="datetime-local"
                        value={eventDetail.end}
                        readOnly
                        className="input input-bordered bg- w-full"
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text text-white">Lokasi</span>
                      </label>
                      <input
                        type="text"
                        value={eventDetail.location}
                        readOnly
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div>
                      {
                        <>
                          {eventDetail.reminder_minutes?.map((res, index) => (
                            <div key={index}>
                              {res.method == "popup" && (
                                <div className="flex gap-3 items-center mt-3">
                                  <p>Notifikasi</p>
                                  <div>
                                    <>
                                      <input
                                        type="text"
                                        value={res.minutes}
                                        readOnly
                                        className="input input-bordered w-24 h-10"
                                      />
                                    </>
                                  </div>
                                  <p>Menit</p>
                                </div>
                              )}
                              {res.method == "email" && (
                                <div className="flex gap-3 items-center mt-3">
                                  <p>Email</p>
                                  <div>
                                    <>
                                      <input
                                        type="text"
                                        value={res.minutes}
                                        readOnly
                                        className="input input-bordered w-24 h-10"
                                      />
                                    </>
                                  </div>
                                  <p>Menit</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </>
                      }
                    </div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-white">Tamu</span>
                    </label>
                    {eventDetail.attendees?.map((res, index) => (
                      <div key={index} className="ml-2 mb-2 text-lg">
                        {res.email}
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="">
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Tanggal Event</th>
                  <th>Judul Event</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {eventHistory?.map((res, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{moment(res.start).format("llll")}</td>
                    <td className="whitespace-normal">{res.title}</td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <label
                          tabIndex={0}
                          className="btn m-1 bg-primary text-white"
                        >
                          Aksi
                        </label>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-fit"
                        >
                          <li>
                            {!res.event_link_on_gcal && (
                              <a onClick={(e) => handleGCal(e, res)} >Buat Event di Google Calendar</a>
                            )}
                            {res.event_link_on_gcal && (
                              <a href={res.event_link_on_gcal} target="_black">
                                Lihat Event di Google Calendar
                              </a>
                            )}
                          </li>
                          <li>
                            {/* The button to open modal */}
                            <label
                              onClick={() => handleSetEventDetail(res)}
                              htmlFor="my-modal-3"
                              className=""
                            >
                              Detail Event
                            </label>
                            {/* <a htmlFor="my-modal-3">Detail Event</a> */}
                          </li>
                          <li>
                            <a
                              onClick={(e) =>
                                handleDelete(e, res.id, res.event_id_on_gcal)
                              }
                            >
                              Hapus
                            </a>
                          </li>
                          <li>
                            <a onClick={(e) => handleICS(e, res)}>Unduh file .ics</a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </DashboardLayout>
    </div>
  );
}
