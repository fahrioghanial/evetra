/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

// Components
import FormModal from "../components/FormModal";
import DragDropUpload from "../components/DragDropUpload";

// Layout
import MainLayout from "../layouts/MainLayout";

// Framework functions
import { handleChange, renderOCRElement } from "../framework-functions/ocr";

export default function Main() {
  const [isTypeError, setIsTypeError] = useState(false)
  // attributes for event
  const [eventAttributes, setEventAttributes] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    location: "",
  });

  // attributes for OCR
  const [OCRAttributes, setOCRAttributes] = useState({
    // handle invitation file
    fileTypes: ["PDF","jpg","png","jpeg"],
    file: null,
    // Boolean for checking if button for extracting the document is clicked
    isClicked: false,
    // Boolean for checking if OCR process is finished
    isOCRFinished: false,
  });

  function handleTypeError() {
    setIsTypeError(true)
    // alert("Tipe file tidak sesuai")
  }

  function handleCloseAlert() {
    setIsTypeError(false)
  }

  return (
    <MainLayout>
      <section id="home" className="mt-5">
        <div className="container m-auto p-5 text-white">
          <div onClick={(e) => handleCloseAlert()} className={`alert alert-error shadow-lg ${isTypeError ? "" : "hidden"}`}>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Tipe File tidak sesuai!</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-3/4 m-auto text-center">
            <img className="md:w-36 w-16 m-auto" src="/logo-no-text.png" alt="Evetra" />
            <p className="md:text-5xl text-xl font-bold">Evetra (Event Extractor)</p>
            <p className="md:text-xl text-base font-normal">Platform yang memudahkanmu untuk menyimpan dan membuat pengingat terhadap agenda dari surat undanganmu, secara cepat, tanpa repot, dan tanpa biaya.</p>
          </div>
          <div className="w-5/6 my-10 m-auto">
            <DragDropUpload
              onTypeError={(e) => handleTypeError()}
              handleChange={(file) => handleChange(file, setOCRAttributes)}
              fileTypes={OCRAttributes.fileTypes}
              file={OCRAttributes.file}
            />
          </div>
          {renderOCRElement(OCRAttributes, eventAttributes, setOCRAttributes, setEventAttributes)}
          <div className="w-fit m-auto my-10">
            <FormModal
              label="Buat Event Manual"
              eventAttributes={eventAttributes}
              setEventAttributes={setEventAttributes}
              setOCRAttributes={setOCRAttributes}
            />
          </div>
        </div>
      </section>
    </MainLayout>
  )
}