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

export default function Profil() {
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
            <div className="my-5">
              <div className="float-left">
                <div className="text-center text-4xl p-10">
                  <span className="font-medium">Profile Picture</span>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png"
                    alt="foto"
                    className="w-60 h-60 mt-8 rounded-full"
                  />
                </div>
              </div>
              <div className="float-left w-3/5">
                <div className="text-2xl mt-10 px-10">
                  <p className="font-medium">Nama</p>
                  <input
                    type="text"
                    placeholder="Nama"
                    readOnly="true"
                    className="mt-5 w-full p-2 rounded-md bg-white text-black"
                  />
                </div>
                <div className="text-2xl mt-5 px-10 self-center">
                  <p className="font-medium">Email</p>
                  <input
                    type="text"
                    placeholder="Email"
                    readOnly="true"
                    className="my-5 w-full p-2 rounded-md bg-white text-black"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </DashboardLayout>
    </div>
  );
}
