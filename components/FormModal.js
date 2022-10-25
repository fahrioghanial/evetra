import { useRouter } from "next/router"

export default function FormModal(props) {
  const router = useRouter();
  return (
    <>
      <label htmlFor="my-modal" className="btn btn-primary modal-button w-fit m-auto">{props.label}</label>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <label htmlFor="my-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <form onSubmit={props.handleSubmit}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-white">Judul Event</span>
              </label>
              <input
                type="text"
                value={props.title}
                onChange={(e) => props.setTitle(e.target.value)}
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
                value={props.description}
                onChange={(e) => props.setDescription(e.target.value)}
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
                value={props.start}
                onChange={(e) => props.setStart(e.target.value)}
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
                value={props.end}
                onChange={(e) => props.setEnd(e.target.value)}
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
                value={props.location}
                onChange={(e) => props.setLocation(e.target.value)}
                placeholder="Lokasi"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <button className="btn btn-primary my-5" type="submit">
              Download File iCalendar (.ics)
            </button>
            <button className={`btn btn-primary my-5 ${router.pathname == "/dashboard" ? "block" : "hidden"}`} onClick={props.handleCreateEventGCalClick}>
              Buat Event di Google Calendar
            </button>
          </form>
        </div>
      </div>
    </>
  )
}