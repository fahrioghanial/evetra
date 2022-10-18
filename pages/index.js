/* eslint-disable react/no-children-prop */
import { useEffect, useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import axios from 'axios';
import PocketBase from 'pocketbase';
import Navbar from "../components/navbar";
import HeadTitle from "../components/headTitle";
import Footer from "../components/footer";

const ics = require('ics')
const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");
const client = new PocketBase(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

// set `<your-key>` and `<your-endpoint>` variables with the values from the Azure portal.
const key = `${process.env.NEXT_PUBLIC_AZURE_KEY}`;
const endpoint = `${process.env.NEXT_PUBLIC_AZURE_ENDPOINT}`;

export default function Main() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");

  const fileTypes = ["PDF"];
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
    setIsClicked(false);
  };
  const [keyValuePairsProcessed, setKeyValuePairsProcessed] = useState([]);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {

  }, []);

  const formatter = (result, index) => {
    return {
      // Table Field
      id: index,
      key: result.key.content,
      value: (result.value && result.value.content) || "<undefined>",
      confidence: result.confidence,
    };
  };

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
        if (keyValuePairsProcessed.length === 0) {
          return (
            <div role="status" className="m-auto w-fit p-5 rounded-lg bg-primary flex gap-3">
              <svg aria-hidden="true" class="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span class="text-white font-semibold text-xl">Mengekstrak Dokumen</span>
            </div>
          );
        } else {
          return <>
            <div className="w-fit m-auto my-10">
              <label htmlFor="my-modal" className="btn btn-primary modal-button w-fit m-auto">Lihat Hasil</label>
              <input type="checkbox" id="my-modal" className="modal-toggle" />
              <div className="modal">
                <div className="modal-box">
                  <label htmlFor="my-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                  <form onSubmit={handleSubmit}>
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text text-white">Judul Event</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
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
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
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
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
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
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Lokasi"
                        className="input input-bordered w-full max-w-xs"
                      />
                    </div>
                    <button className="btn btn-primary my-5" type="submit">
                      Download iCalendar (.ics) File
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </>;
        }
      }

    }
  }

  const handleOCR = (e) => {
    e.preventDefault();
    setTitle("");
    setDescription("");
    setStart("");
    setEnd("");
    setLocation("");
    setIsClicked(true);
    setKeyValuePairsProcessed([]);
    const formData = new FormData();
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
        console.log("colection id: ", collectionId);
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

            setKeyValuePairsProcessed(formatted_data);

            if (titleTemp == "" || descriptionTemp == "") {
              setTitle(file.name.replace(".pdf", ""))
              setDescription(file.name.replace(".pdf", ""))
            } else {
              setTitle(titleTemp);
              setDescription(descriptionTemp);
            }
          }

        }

        main().catch((error) => {
          console.error("An error occurred:", error);
        });
      })
    })
  };

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

      console.log(startArray)

      // Create .ics file
      const eventFinal = {
        start: startArray,
        end: endArray,
        title: title,
        description: description,
        location: location,
      }

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

  return (
    <div data-theme="dark" id="app">
      <HeadTitle />
      <Navbar />
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
          {renderOCRElement()}
          <div className="w-fit m-auto my-10">
            <label htmlFor="my-modal" className="btn btn-primary modal-button w-fit m-auto">Buat Event Manual</label>
            <input type="checkbox" id="my-modal" className="modal-toggle" />
            <div className="modal">
              <div className="modal-box">
                <label htmlFor="my-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                <form onSubmit={handleSubmit}>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-white">Judul Event</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
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
                      value={end}
                      onChange={(e) => setEnd(e.target.value)}
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
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Lokasi"
                      className="input input-bordered w-full max-w-xs"
                    />
                  </div>
                  <button className="btn btn-primary my-5" type="submit">
                    Download iCalendar (.ics) File
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}