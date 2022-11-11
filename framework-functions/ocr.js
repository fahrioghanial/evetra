import axios from 'axios';
import PocketBase from 'pocketbase';

// Components
import FormModal from "../components/FormModal";

// Framework functions
import { handleCreateEventOnGCal } from "./gcalendar";

// connect to PocketBase SDK
const client = new PocketBase(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

// Import azure cognitive service form recognizer
const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

// set key and endpoint variables with the values from the Azure portal.
const key = `${process.env.NEXT_PUBLIC_AZURE_KEY}`;
const endpoint = `${process.env.NEXT_PUBLIC_AZURE_ENDPOINT}`;

export const handleChange = (file, setOCRAttributes) => {
  setOCRAttributes(OCRAttributes => ({
    ...OCRAttributes,
    file: file,
    isClicked: false
  }))
};

// Function for formatting the extracted result that return from azure form recognizer
export const formatter = (result, index) => {
  return {
    id: index,
    key: result.key.content,
    value: (result.value && result.value.content) || "<undefined>",
    confidence: result.confidence,
  };
};

// Function for rendering button, loading jsx, and show result from the extraction
export function renderOCRElement(OCRAttributes, eventAttributes, setOCRAttributes, setEventAttributes) {
  if (OCRAttributes.file === null) {
    return;
  } else {
    if (!OCRAttributes.isClicked) {
      return <>
        <div className="text-center">
          <button className="btn btn-primary my-2" type="submit" onClick={(e) => handleOCR(e, OCRAttributes, setOCRAttributes, setEventAttributes)}>
            Ekstrak Informasi Dokumen
          </button>
        </div>
      </>
    } else {
      if (!OCRAttributes.isOCRFinished) {
        return <>
          <div role="status" className="m-auto w-fit p-5 rounded-lg bg-primary flex gap-3">
            <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="text-white font-semibold text-xl">Mengekstrak Dokumen</span>
          </div>
        </>
      } else {
        return <>
          <div className="w-fit m-auto my-10">
            <FormModal
              label="Lihat Hasil"
              eventAttributes={eventAttributes}
              setOCRAttributes={setOCRAttributes}
              setEventAttributes={setEventAttributes}
            />
          </div>
        </>
      }
    }
  }
}

export function renderOCRElementAfterSignIn(OCRAttributes, eventAttributes, setOCRAttributes, setEventAttributes, event) {
  if (OCRAttributes.file === null) {
    return;
  } else {
    if (!OCRAttributes.isClicked) {
      return <>
        <div className="text-center">
          <button className="btn btn-primary my-2" type="submit" onClick={(e) => handleOCR(e, OCRAttributes, setOCRAttributes, setEventAttributes)}>
            Ekstrak Informasi Dokumen
          </button>
        </div>
      </>
    } else {
      if (!OCRAttributes.isOCRFinished) {
        return <>
          <div role="status" className="m-auto w-fit p-5 rounded-lg bg-primary flex gap-3">
            <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="text-white font-semibold text-xl">Mengekstrak Dokumen</span>
          </div>
        </>
      } else {
        return <>
          <div className="w-fit m-auto my-10">
            <FormModal
              label="Lihat Hasil"
              eventAttributes={eventAttributes}
              setEventAttributes={setEventAttributes}
              setOCRAttributes={setOCRAttributes}
              handleCreateEventOnGCal={(e) => handleCreateEventOnGCal(e, event, setEventAttributes, eventAttributes)}
            />
          </div>
        </>
      }
    }
  }
}

// Function for extracting pdf document
export const handleOCR = (e, OCRAttributes, setOCRAttributes, setEventAttributes) => {
  e.preventDefault();
  // setEventAttributes(eventAttributes => ({
  //   ...eventAttributes,
  //   title: "",
  //   description: "",
  //   location: "",
  //   start: "",
  //   end: ""
  // }));
  setOCRAttributes(OCRAttributes => ({
    ...OCRAttributes,
    isClicked: true,
    isOCRFinished: false,
  }));
  const formData = new FormData();
  // Send users PDF File to database
  formData.append('original_document', OCRAttributes.file);
  // Get users IPv4 address
  axios.get('https://geolocation-db.com/json/').then(function (result) {
    // Send users IPv4 address to database
    formData.append('ip_address', result.data.IPv4);
    formData.append('email', localStorage.getItem("email"));
    const record = client.records.create('ocr_logging', formData);
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

            if (/waktu|pukul/i.test(result.key)) {
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
              setEventAttributes(eventAttributes => ({
                ...eventAttributes,
                start: dateTemp[0] + "-" + dateTemp[1] + "-" + dateTemp[2] + "T" + startTimeTemp[0] + ":" + startTimeTemp[1],
                end: dateTemp[0] + "-" + dateTemp[1] + "-" + dateTemp[2] + "T" + endTimeTemp[0] + ":" + endTimeTemp[1]
              }));
            }

            if (/tempat/i.test(result.key)) {
              console.log("key: ", result.key)
              console.log("value: ", result.value)
              setEventAttributes(eventAttributes => ({
                ...eventAttributes,
                location: result.value
              }));
            }
          })

          if (titleTemp == "" || descriptionTemp == "") {
            setEventAttributes(eventAttributes => ({
              ...eventAttributes,
              title: OCRAttributes.file.name.replace(".pdf", ""),
              description: OCRAttributes.file.name.replace(".pdf", "")
            }));
          } else {
            setEventAttributes(eventAttributes => ({
              ...eventAttributes,
              title: titleTemp,
              description: descriptionTemp
            }));
          }

          setOCRAttributes(OCRAttributes => ({
            ...OCRAttributes,
            isOCRFinished: true,
          }));
        }

      }

      main().catch((error) => {
        console.error("An error occurred:", error);
      });
    })
  })
};