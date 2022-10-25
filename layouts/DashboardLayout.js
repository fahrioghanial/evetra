// components
import Head from "next/head";
import FooterDashboard from "../components/Dashboard/FooterDashboard";
import NavbarDashboard from "../components/Dashboard/NavbarDashboard";
import Sidebar from "../components/Dashboard/Sidebar";

export default function DashboardLayout(props) {
  const title = `Evetra ${props.title != null ? " - " + props.title : ""}`
  return (
    <>
      <Head>
        <title>
          {title}
        </title>
      </Head>
      <Sidebar />
      <div data-theme="dark">
        <NavbarDashboard userPicture={props.userPicture} handleSignOut={props.handleSignOut} userEmail={props.userEmail} />
        <div className="mx-2 md:ml-80 pb-5 md:mr-5 text-white">
          {props.children}
          <FooterDashboard />
        </div>
      </div>
    </>
  )
}
