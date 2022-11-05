import { useRef, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useRouter } from "next/router";
import Link from "next/link";

export default function Sidebar() {
  const [isOpened, setIsOpened] = useState(true);
  const router = useRouter();
  function openSidebar() {
    setIsOpened(!isOpened)
  }

  return (
    <>
      <section className="">
        <span
          className={`absolute text-white text-4xl top-5 left-4 cursor-pointer ${isOpened ? "hidden" : ""} z-50`}

          onClick={openSidebar}
        >
          <i className="bi bi-filter-left px-2 bg-gray-900 rounded-md"></i>
        </span>
        <div
          className={`fixed top-0 bottom-0 lg:left-0 p-2 w-[300px] overflow-y-auto text-center bg-gray-900 ${isOpened ? "" : "hidden"} z-50`}
        >
          <div className="text-gray-100 text-xl">
            <div className="p-2.5 mt-1 flex items-center">
              <Link href={"/dashboard"}>
                <a className="w-40">
                  <img className="" src="/logo.png" alt="Evetra" />
                </a>
              </Link>
              <i
                className={`bi bi-x cursor-pointer ml-28 lg:hidden`}

                onClick={openSidebar}
              ></i>
            </div>
            <div className="my-2 bg-gray-600 h-[1px]"></div>
          </div>
          <Link href="/dashboard">
          <div
            className={`p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-primary text-white ${router.pathname == "/dashboard" ? "bg-primary" : ""}`}
          >
            <i className="bi bi-house-door-fill"></i>
            <span className="text-[15px] ml-4 text-gray-200 font-bold">Dasbor</span>
          </div>
          </Link>
          <Link href="/dashboard/riwayat">
          <div
            className={`p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-primary text-white ${router.pathname == "/dashboard/history" ? "bg-primary" : ""}`}
          >
            <i className="bi bi-clock-history"></i>
            <span className="text-[15px] ml-4 text-gray-200 font-bold">Riwayat</span>
          </div>
          </Link>
          <Link href="/dashboard/profil">
          <div
            className={`p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-primary text-white ${router.pathname == "/dashboard/profile" ? "bg-primary" : ""}`}
          >
            <i className="bi bi-person-fill"></i>
            <span className="text-[15px] ml-4 text-gray-200 font-bold">Profil</span>
          </div>
          </Link>
          <div className="my-4 bg-gray-600 h-[1px]"></div>
        </div>
      </section>
    </>
  )
}
