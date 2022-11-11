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

// connect to PocketBase SDK
const client = new PocketBase(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

export default function Riwayat() {
  const [eventHistory, setEventHistory] = useState([])
  const [eventDetail, setEventDetail] = useState({})
  const router = useRouter()

  function handleSetEventDetail(res) {
    setEventDetail(res)
  }

  async function handleDelete(e, record_id, event_id_on_gcal) {
    e.preventDefault()
    if (event_id_on_gcal ? confirm("Hapus Riwayat Event (Event akan terhapus juga pada Google Calendar)?") : confirm("Hapus Riwayat Event?")) {
      if (event_id_on_gcal) {
        gapi.client.request({
          'path': `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event_id_on_gcal}`,
          'method': 'DELETE'
        }).then((res) => { console.log(res) })
      }
      await client.records.delete('event_history', record_id);
      const record = client.records.getFullList('event_history', 200, {
        sort: '-created', filter: `user = "${localStorage.getItem("email")}"`, '$autoCancel': false
      })
      record.then((result) => {
        console.log(result)
        setEventHistory(result)
      })
        .catch(err => {
          console.log(err);
          console.log(err.isAbort); // true
        })

    }
  }

  useEffect(() => {
    const record = client.records.getFullList('event_history', 200, {
      sort: '-created', filter: `user = "${localStorage.getItem("email")}"`, '$autoCancel': false
    })
    record.then((result) => {
      console.log(result)
      setEventHistory(result)
    })
      .catch(err => {
        console.log(err);
        console.log(err.isAbort); // true
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <DashboardLayout title="Profil">
        <section id="home" className="my-4">
          {/* Put this part before </body> tag */}
          <input type="checkbox" id="my-modal-3" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box relative">
              <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
              <h3 className="text-lg font-bold">{eventDetail.title}</h3>
              <p className="py-4">Youve been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
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
                {
                  eventHistory?.map((res, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{moment(res.start).format('llll')}</td>
                      <td>{res.title}</td>
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
                              {!res.event_link_on_gcal &&
                                <a>Buat Event di Google Calendar</a>
                              }
                              {res.event_link_on_gcal &&
                                <a href={res.event_link_on_gcal} target="_black">Lihat Event di Google Calendar</a>
                              }
                            </li>
                            <li>
                              {/* The button to open modal */}
                              <label onClick={() => handleSetEventDetail(res)} htmlFor="my-modal-3" className="">Detail Event</label>
                              {/* <a htmlFor="my-modal-3">Detail Event</a> */}
                            </li>
                            <li>
                              <a onClick={(e) => handleDelete(e, res.id, res.event_id_on_gcal)}>Hapus</a>
                            </li>
                            <li>
                              <a>Unduh file .ics</a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </section>
      </DashboardLayout>
    </div>
  );
}
