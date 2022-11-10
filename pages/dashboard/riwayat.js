/* eslint-disable react/no-children-prop */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import PocketBase from "pocketbase";

// Components
import DragDropUpload from "../../components/DragDropUpload";
import FormModal from "../../components/FormModal";

// Layout
import DashboardLayout from "../../layouts/DashboardLayout";
import { useRouter } from "next/router";

// import .ics file generation module
const ics = require("ics");

// connect to PocketBase SDK
const client = new PocketBase(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

// Import azure cognitive service form recognizer
const {
  AzureKeyCredential,
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");

// set key and endpoint variables with the values from the Azure portal.
const key = `${process.env.NEXT_PUBLIC_AZURE_KEY}`;
const endpoint = `${process.env.NEXT_PUBLIC_AZURE_ENDPOINT}`;

export default function Riwayat() {
  const router = useRouter();
  const data = router.query;
  // Event atributes
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");

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

  const CLIENT_ID = `${process.env.NEXT_PUBLIC_CLIENT_ID}`;

  // Discovery doc URL for APIs used by the quickstart
  const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  const SCOPES =
    "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

  let tokenClient;

  return (
    <div>
      <DashboardLayout title="Profil">
        <div className="mx-2 md:ml-80 pb-5 md:mr-5 text-white">
          <section id="home" className="mt-5">
          <div className="overflow-x-scroll">
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
                <tr>
                    <th>1</th>
                    <td>10 November 2022</td>
                    <td>Hari Pahlawan</td>
                    <td>
                    <div className="dropdown">
                    <label tabIndex={0} className="btn m-1 bg-primary text-white">Aksi</label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-fit">
                            <li><a>Buat Event di Google Calendar</a></li>
                            <li><a>Detail Event</a></li>
                            <li><a>Hapus</a></li>
                            <li><a>Unduh file .ics</a></li>
                        </ul>
                    </div>
                    </td>
                </tr>
                <tr>
                    <th>2</th>
                    <td>16 November 2022</td>
                    <td>Hari Praktikum</td>
                    <td>
                    <div className="dropdown">
                    <label tabIndex={0} className="btn m-1 bg-primary text-white">Aksi</label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-fit">
                            <li><a>Buat Event di Google Calendar</a></li>
                            <li><a>Detail Event</a></li>
                            <li><a>Hapus</a></li>
                            <li><a>Unduh file .ics</a></li>
                        </ul>
                    </div>
                    </td>
                </tr>
                <tr>
                    <th>3</th>
                    <td>22 November 2022</td>
                    <td>Kegiatan sosialisasi metaverse yang diakhiri dengan pengarahan mahasiswa untuk mengikuti kegiatan sertifikasi ICT Huawei.</td>
                    <td>
                    <div className="dropdown">
                    <label tabIndex={0} className="btn m-1 bg-primary text-white">Aksi</label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-fit">
                            <li><a>Buat Event di Google Calendar</a></li>
                            <li><a>Detail Event</a></li>
                            <li><a>Hapus</a></li>
                            <li><a>Unduh file .ics</a></li>
                        </ul>
                    </div>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
          </section>
        </div>
      </DashboardLayout>
    </div>
  );
}
