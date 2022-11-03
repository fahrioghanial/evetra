/* eslint-disable react/no-children-prop */
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import PocketBase from 'pocketbase';

// Components
import DragDropUpload from "../../components/DragDropUpload";
import FormModal from "../../components/FormModal";

// Layout
import DashboardLayout from "../../layouts/DashboardLayout";
import { useRouter } from "next/router";

// import .ics file generation module
const ics = require('ics')

// connect to PocketBase SDK
const client = new PocketBase(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

// Import azure cognitive service form recognizer
const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

// set key and endpoint variables with the values from the Azure portal.
const key = `${process.env.NEXT_PUBLIC_AZURE_KEY}`;
const endpoint = `${process.env.NEXT_PUBLIC_AZURE_ENDPOINT}`;

export default function Dashboard() {
  const router = useRouter();

  // Event atributes
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [emailArray, setEmailArray] = useState([]);
  const [eventHTMLLink, setEventHTMLLink] = useState("");
  const [notif, setNotif] = useState(30);
  const [notifEmail, setNotifEmail] = useState(30);
  const [isNotifEmailEnabled, setIsNotifEmailEnabled] = useState(false);
  const [notifArray, setNotifArray] = useState([]);

  // Boolean for checking if user has finished filling the form 
  const [isFinished, setIsFinished] = useState(false);

  // File
  const fileTypes = ["PDF"];
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
    setIsClicked(false);
  };

  // Boolean for checking if button for extracting the document is clicked
  const [isClicked, setIsClicked] = useState(false);

  // Boolean for checking if OCR process of extracting the document is finished
  const [isOCRFinished, setIsOCRFinished] = useState(false);

  // Function for formatting the extracted result that return from azure form recognizer
  const formatter = (result, index) => {
    return {
      id: index,
      key: result.key.content,
      value: (result.value && result.value.content) || "<undefined>",
      confidence: result.confidence,
    };
  };

  // Function for download file
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

  // Function for rendering button, loading jsx, and show result from the extraction
  function renderOCRElement() {
    if (file === null) {
      return;
    } else {
      if (!isClicked) {
        return <>
          <div className="text-center">
            <button className="btn btn-primary my-2" type="submit" onClick={handleOCR}>
              Ekstrak Informasi Dokumen
            </button>
          </div>
        </>;
      } else {
        if (!isOCRFinished) {
          return (
            <div role="status" className="m-auto w-fit p-5 rounded-lg bg-primary flex gap-3">
              <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="text-white font-semibold text-xl">Mengekstrak Dokumen</span>
            </div>
          );
        } else {
          return <>
            <div className="w-fit m-auto my-10">
              <FormModal
                label="Lihat Hasil"
                title={title}
                description={description}
                start={start}
                end={end}
                location={location}
                setTitle={setTitle}
                setDescription={setDescription}
                setStart={setStart}
                setEnd={setEnd}
                setLocation={setLocation}
                handleSubmit={handleSubmit}
                handleCreateEventGCalClick={(e) => handleCreateEventGCalClick(e)}
                isFinished={isFinished}
                handleFinish={handleFinish}
                resetEvent={resetEvent}
                eventHTMLLink={eventHTMLLink}
                setTempEmail={setTempEmail}
                addGuests={addGuests}
                removeGuests={removeGuests}
                notif={notif}
                notifEmail={notifEmail}
                setNotif={setNotif}
                setNotifEmail={setNotifEmail}
                addNotifEmail={addNotifEmail}
                isNotifEmailEnabled={isNotifEmailEnabled}
              />
            </div>
          </>;
        }
      }

    }
  }

  // Function for extracting pdf document
  const handleOCR = (e) => {
    e.preventDefault();
    setTitle("");
    setDescription("");
    setStart("");
    setEnd("");
    setLocation("");
    setIsClicked(true);
    setIsOCRFinished(false);
    const formData = new FormData();
    // Send users PDF File to database
    formData.append('original_document', file);
    // Get users IPv4 address
    axios.get('https://geolocation-db.com/json/').then(function (result) {
      // Send users IPv4 address to database
      formData.append('ip_address', result.data.IPv4);
      const record = client.records.create('documents', formData);
      record.then((result) => {
        const collectionId = result["@collectionId"];
        const recordId = result.id;
        const filename = result.original_document;
        const titleTemp = "";
        const descriptionTemp = "";
        const dateTemp = "";
        const startTimeTemp = "";
        const endTimeTemp = "";

        // document direct download link for cognitive service
        const formUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/files/${collectionId}/${recordId}/${filename}`;
        console.log("collection id: ", collectionId);
        console.log("record id: ", recordId);
        console.log("filename: ", filename);

        async function main() {
          const clientAzure = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

          const poller = await clientAzure.beginAnalyzeDocumentFromUrl("prebuilt-document", formUrl);

          const { keyValuePairs } = await poller.pollUntilDone();

          if (!keyValuePairs || keyValuePairs.length <= 0) {
            console.log("No key-value pairs were extracted from the document.");
          } else {
            console.log("Key-Value Pairs:");
            const formatted_data = [];
            keyValuePairs.map((result, index) => {
              formatted_data.push(formatter(result, index));
            });

            formatted_data.map((result) => {
              if (/tema|acara|kegiatan/i.test(result.key)) {
                console.log("key: ", result.key)
                console.log("value: ", result.value)
                titleTemp = result.value;
                descriptionTemp = result.value;
              }
              if (/hari|tanggal/i.test(result.key)) {
                console.log("key: ", result.key)
                console.log("value: ", result.value)
                dateTemp = result.value;
                if (dateTemp.includes(",")) {
                  dateTemp = dateTemp.substring(result.value.indexOf(",") + 1);
                } else if (dateTemp.includes("/")) {
                  dateTemp = dateTemp.substring(result.value.indexOf("/") + 1);
                }
                if (dateTemp.indexOf(" ") == 0) {
                  dateTemp = dateTemp.substring(1);
                }
                dateTemp = dateTemp.split(/[" "]/);

                if (dateTemp[0].length == 1) {
                  dateTemp[0] = "0" + dateTemp[0];
                }
                if (/Jan/i.test(dateTemp[1])) {
                  dateTemp[1] = "01";
                }
                else if (/Feb/i.test(dateTemp[1])) {
                  dateTemp[1] = "02"
                }
                else if (/Mar/i.test(dateTemp[1])) {
                  dateTemp[1] = "03"
                }
                else if (/Apr/i.test(dateTemp[1])) {
                  dateTemp[1] = "04"
                }
                else if (/Mei/i.test(dateTemp[1])) {
                  dateTemp[1] = "05"
                }
                else if (/Jun/i.test(dateTemp[1])) {
                  dateTemp[1] = "06"
                }
                else if (/Jul/i.test(dateTemp[1])) {
                  dateTemp[1] = "07"
                }
                else if (/Agu/i.test(dateTemp[1])) {
                  dateTemp[1] = "08"
                }
                else if (/Sep/i.test(dateTemp[1])) {
                  dateTemp[1] = "09"
                }
                else if (/Okt/i.test(dateTemp[1])) {
                  dateTemp[1] = "10"
                }
                else if (/Nov/i.test(dateTemp[1])) {
                  dateTemp[1] = "11"
                }
                else if (/Des/i.test(dateTemp[1])) {
                  dateTemp[1] = "12"
                }

                dateTemp = dateTemp.reverse();

                console.log("dateTemp: ", dateTemp);
              }

              if (/waktu/i.test(result.key)) {
                console.log("key: ", result.key)
                console.log("value: ", result.value)
                startTimeTemp = result.value.substring(0, 5).split(/[.]/);
                endTimeTemp = result.value.substring(result.value.length - 5);
                if (endTimeTemp.includes(".")) {
                  endTimeTemp = endTimeTemp.split(/[.]/);
                } else {
                  endTimeTemp = startTimeTemp.map(Number);
                  endTimeTemp[0] = endTimeTemp[0] + 1;
                  endTimeTemp = endTimeTemp.map(String);
                  if (endTimeTemp[0].length == 1) {
                    endTimeTemp[0] = "0" + endTimeTemp[0];
                  }
                  if (endTimeTemp[1].length == 1) {
                    endTimeTemp[1] = "0" + endTimeTemp[1];
                  }
                }
                console.log("start: ", startTimeTemp)
                console.log("end: ", endTimeTemp)
                setStart(dateTemp[0] + "-" + dateTemp[1] + "-" + dateTemp[2] + "T" + startTimeTemp[0] + ":" + startTimeTemp[1]);
                setEnd(dateTemp[0] + "-" + dateTemp[1] + "-" + dateTemp[2] + "T" + endTimeTemp[0] + ":" + endTimeTemp[1]);
              }

              if (/tempat/i.test(result.key)) {
                console.log("key: ", result.key)
                console.log("value: ", result.value)
                setLocation(result.value)
              }
            })

            if (titleTemp == "" || descriptionTemp == "") {
              setTitle(file.name.replace(".pdf", ""))
              setDescription(file.name.replace(".pdf", ""))
            } else {
              setTitle(titleTemp);
              setDescription(descriptionTemp);
            }

            setIsOCRFinished(true);
          }

        }

        main().catch((error) => {
          console.error("An error occurred:", error);
        });
      })
    })
  };

  // Function for handling form submit download .ics file
  const handleSubmit = (e) => {
    e.preventDefault();

    if (title && start && end) {
      // Get users IPv4 address
      axios.get('https://geolocation-db.com/json/').then(function (result) {
        // Send users IPv4 address to database
        client.records.create('documents', { ip_address: result.data.IPv4 });
      })

      // Split string to array of string and then convert it to array of number
      const startArrayString = start.split(/[-T:]/)
      const endArrayString = end.split(/[-T:]/)
      const startArray = startArrayString.map(Number)
      const endArray = endArrayString.map(Number)

      // Create .ics file
      const eventFinal = {
        start: startArray,
        end: endArray,
        title: title,
        description: description,
        location: location,
      }

      // Download .ics file
      ics.createEvent(eventFinal, (error, value) => {
        if (error) {
          console.log(error)
          return
        }
        download(value, `${title}.ics`, "text/plain;charset=utf-8")
      })
    } else {
      alert("Judul, Waktu Mulai, dan Waktu Selesai wajib diisi")
    }
  };

  // Object event as a resource for google calendar API
  const event = {
    'summary': title,
    'location': location,
    'description': description,
    'start': {
      'dateTime': start + ":00",
      'timeZone': 'Asia/Jakarta'
    },
    'end': {
      'dateTime': end + ":00",
      'timeZone': 'Asia/Jakarta'
    },
    // 'recurrence': [
    //   'RRULE:FREQ=DAILY;COUNT=2'
    // ],
    'attendees': emailArray,
    // 'attendees': [
    //   { 'email': 'dickyrahmahermawan@gmail.com' },
    //   { 'email': 'aaaabim@gmail.com' },
    //   { 'email': 'abdurrahman1270@gmail.com' },
    //   { 'email': 'windudr@gmail.com' },
    //   { 'email': 'ghanialfatihah@gmail.com' },
    // ],
    'reminders': {
      'useDefault': false,
      'overrides': notifArray
      // 'overrides': [
      //   { 'method': 'email', 'minutes': notif },
      //   { 'method': 'popup', 'minutes': 10 }
      // ]
    }
  };

  // Function for handling add guests
  function addGuests(e) {
    e.preventDefault();

    if (tempEmail != "" && tempEmail.includes("@")) {
      setEmailArray(emailArray => [...emailArray, { 'email': tempEmail }]);
      setTempEmail("")
    }
  }

  function removeGuests(e, email) {
    e.preventDefault();
    setEmailArray(emailArray.filter(item => item.email != email));
  }

  function addNotifEmail(e) {
    e.preventDefault();
    setIsNotifEmailEnabled(true);
  }

  // Function for handling create event on google calendar
  async function handleCreateEventOnGCal(e) {
    e.preventDefault();
    // console.log(notifArray)
    // console.log(notif)
    // console.log(notifEmail)
    try {
      const request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        // 'sendUpdates': 'all',
        'resource': event,
      });

      request.execute(function (event) {
        setEventHTMLLink(event.htmlLink)
        console.log(event)
      });
    } catch (err) {
      console.error(err)
      return;
    }
  }

  // Function for handle if user already finish filling the form
  const handleFinish = (e) => {
    e.preventDefault();
    if (title && start && end) {

      setIsFinished(true);
      if (isNotifEmailEnabled) {
        setNotifArray([
          { 'method': 'email', 'minutes': notifEmail },
          { 'method': 'popup', 'minutes': notif }
        ])
      } else {
        setNotifArray([
          { 'method': 'popup', 'minutes': notif }
        ])
      }
    } else {
      alert("Judul, Waktu Mulai, dan Waktu Selesai wajib diisi")
    }
  }

  // Function for reset the form
  function resetEvent() {
    setTitle("");
    setDescription("");
    setStart("");
    setEnd("");
    setLocation("");
    setEmailArray([]);
    setTempEmail("");
    setEventHTMLLink("");
    setNotif(30);
    setNotifEmail(30);
    setIsFinished(false);
    setIsNotifEmailEnabled(false);
  }

  return (
    <DashboardLayout>
      <section id="home" className="mt-5">
        {/* <div className="mx-2 md:ml-80 pb-5 md:mr-5 text-white"> */}
        <div className="container m-auto p-5 text-white h-screen">
          <DragDropUpload
            handleChange={handleChange}
            fileTypes={fileTypes}
            file={file}
          />
          <div className="my-5">
            {renderOCRElement()}
          </div>
          <div className="w-fit m-auto my-5">
            <FormModal
              label="Buat Event Manual"
              title={title}
              description={description}
              start={start}
              end={end}
              location={location}
              setTitle={setTitle}
              setDescription={setDescription}
              setStart={setStart}
              setEnd={setEnd}
              setLocation={setLocation}
              handleSubmit={handleSubmit}
              handleCreateEventGCalClick={(e) => handleCreateEventOnGCal(e)}
              isFinished={isFinished}
              handleFinish={handleFinish}
              resetEvent={resetEvent}
              eventHTMLLink={eventHTMLLink}
              setTempEmail={setTempEmail}
              tempEmail={tempEmail}
              addGuests={addGuests}
              emailArray={emailArray}
              removeGuests={removeGuests}
              notif={notif}
              notifEmail={notifEmail}
              setNotif={setNotif}
              setNotifEmail={setNotifEmail}
              addNotifEmail={addNotifEmail}
              isNotifEmailEnabled={isNotifEmailEnabled}
            />
          </div>
          {/* </div> */}
          {/* <button className="btn btn-primary" onClick={Object.keys(userToken).length == 0 ? handleSignIn : handleSignout}>
            {Object.keys(userToken).length == 0 ? "Sign In" : "Sign Out"}
          </button> */}
        </div>
      </section>
    </DashboardLayout>
  )
}
