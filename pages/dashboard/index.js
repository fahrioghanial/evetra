import { useState } from "react";

// Components
import DragDropUpload from "../../components/DragDropUpload";
import FormModal from "../../components/FormModal";

// Layout
import DashboardLayout from "../../layouts/DashboardLayout";

// Framework functions
import { handleChange, renderOCRElementAfterSignIn } from "../../framework-functions/ocr";
import { handleCreateEventOnGCal } from "../../framework-functions/gcalendar";

export default function Dashboard() {
  const [isTypeError, setIsTypeError] = useState(false)
  // attributes for event
  const [eventAttributes, setEventAttributes] = useState({
    eventID: "",
    title: "",
    description: "",
    start: "",
    end: "",
    location: "",
    eventHTMLLink: "",
    // eventIDOnGCal: "",
    notif: 30,
    notifEmail: 30,
    isNotifEmailEnabled: false,
    emailAray: [],
    notifArray: []
  });

  // attributes for OCR
  const [OCRAttributes, setOCRAttributes] = useState({
    // handle invitation file
    fileTypes: ["PDF", "jpg", "png", "jpeg"],
    file: null,
    // Boolean for checking if button for extracting the document is clicked
    isClicked: false,
    // Boolean for checking if OCR process is finished
    isOCRFinished: false,
  });

  // Object event as a resource for google calendar API
  const event = {
    'summary': eventAttributes.title,
    'location': eventAttributes.location,
    'description': eventAttributes.description,
    'start': {
      'dateTime': eventAttributes.start + ":00",
      'timeZone': 'Asia/Jakarta'
    },
    'end': {
      'dateTime': eventAttributes.end + ":00",
      'timeZone': 'Asia/Jakarta'
    },
    'attendees': eventAttributes.emailArray,
    // 'attendees': [
    //   { 'email': 'dickyrahmahermawan@gmail.com' },
    //   { 'email': 'aaaabim@gmail.com' },
    //   { 'email': 'abdurrahman1270@gmail.com' },
    //   { 'email': 'windudr@gmail.com' },
    //   { 'email': 'ghanialfatihah@gmail.com' },
    // ],
    'reminders': {
      'useDefault': false,
      'overrides': eventAttributes.notifArray
      // 'overrides': [
      //   { 'method': 'email', 'minutes': notif },
      //   { 'method': 'popup', 'minutes': 10 }
      // ]
    }
  };

  function handleTypeError() {
    setIsTypeError(true)
    // alert("Tipe file tidak sesuai")
  }

  function handleCloseAlert() {
    setIsTypeError(false)
  }

  return (
    <DashboardLayout title="Dasbor">
      <section id="home" className="mt-5">
        <div className="container m-auto p-5 text-white h-screen">
          <div onClick={(e) => handleCloseAlert()} className={`alert alert-error shadow-lg ${isTypeError ? "" : "hidden"} mb-5 hover:cursor-pointer`}>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Tipe File tidak sesuai!</span>
            </div>
          </div>
          <DragDropUpload
            onTypeError={(e) => handleTypeError()}
            handleChange={(file) => handleChange(file, setOCRAttributes)}
            fileTypes={OCRAttributes.fileTypes}
            file={OCRAttributes.file}
          />
          <div className="my-5">
            {renderOCRElementAfterSignIn(OCRAttributes, eventAttributes, setOCRAttributes, setEventAttributes, event)}
          </div>
          <div className="w-fit m-auto my-5">
            <FormModal
              label="Buat Event Manual"
              eventAttributes={eventAttributes}
              setEventAttributes={setEventAttributes}
              setOCRAttributes={setOCRAttributes}
              handleCreateEventOnGCal={(e) => handleCreateEventOnGCal(e, event, setEventAttributes, eventAttributes)}
            />
          </div>
        </div>
      </section>
    </DashboardLayout>
  )
}