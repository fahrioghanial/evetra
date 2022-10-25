/* eslint-disable react/no-children-prop */
import { FileUploader } from "react-drag-drop-files";

export default function DragDropUpload(props) {
  return (
    <>
      <FileUploader handleChange={props.handleChange} name="file" types={props.fileTypes} label="upload sini"
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
              <p>{props.file ? `Nama File: ${props.file.name}` : ""}</p>
            </div>
          </>
        }
      />
    </>
  )
}