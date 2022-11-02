// components
import Head from "next/head";
import { useRouter } from "next/router";
import FooterDashboard from "../components/Dashboard/FooterDashboard";
import NavbarDashboard from "../components/Dashboard/NavbarDashboard";
import Sidebar from "../components/Dashboard/Sidebar";


export default function DashboardLayout(props) {
  const router = useRouter();
  function checkSession() {
    if (localStorage.getItem('expiration') < Date.now()) {
      alert('Sesi Habis!, Silakan masuk kembali');
      router.reload();
    }
  }

  const title = `Evetra ${props.title != null ? " - " + props.title : ""}`
  return (
    <>
      <Head>
        <title>
          {title}
        </title>
      </Head>
      <div onClick={checkSession}>
        <Sidebar />
        <div data-theme="dark">
          <NavbarDashboard userPicture={props.userPicture} handleSignOut={props.handleSignOut} userEmail={props.userEmail} />
          <div className="mx-2 md:ml-80 pb-5 md:mr-5 text-white">
            {props.children}
            <FooterDashboard />
          </div>
        </div>
      </div>
    </>
  )
}
