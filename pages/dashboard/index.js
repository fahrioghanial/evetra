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
  // attributes for event
  const [eventAttributes, setEventAttributes] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    location: "",
    eventHTMLLink: "",
    notif: 30,
    notifEmail: 30,
    isNotifEmailEnabled: false,
    emailArray: [],
    notifArray: []
  });

  // attributes for OCR
  const [OCRAttributes, setOCRAttributes] = useState({
    // handle invitation file
    fileTypes: ["PDF"],
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

  return (
    <DashboardLayout title="Dasbor">
      <section id="home" className="mt-5">
        <div className="container m-auto p-5 text-white h-screen">
          <DragDropUpload
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
              handleCreateEventOnGCal={(e) => handleCreateEventOnGCal(e, event, setEventAttributes)}
            />
          </div>
        </div>
      </section>
    </DashboardLayout>
  )
}