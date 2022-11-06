// components
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FooterDashboard from "../components/Dashboard/FooterDashboard";
import NavbarDashboard from "../components/Dashboard/NavbarDashboard";
import Sidebar from "../components/Dashboard/Sidebar";

// Framework functions
import { gapiLoaded, gisLoaded, handleSignOut, checkSession } from "../framework-functions/gis_and_gapi";

export default function DashboardLayout(props) {
  const router = useRouter();
  const [userToken, setUserToken] = useState({});
  const [userEmail, setUserEmail] = useState("");
  const [userPicture, setUserPicture] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  const title = `Evetra ${props.title != null ? " - " + props.title : ""}`

  useEffect(() => {
    if (localStorage.getItem('expiration') != null) {
      setTimeout(checkSession(setUserToken, setUserEmail, setUserPicture), (localStorage.getItem('expiration') - Date.now()))
    }
    if (localStorage.getItem('token') == null) {
      router.push("/");
    } else if (localStorage.getItem('expiration') > Date.now()) {
      console.log('token still valid');
      console.log('token time remaining (in second):', (localStorage.getItem('expiration') - Date.now()) / 1000)
      setUserToken(JSON.parse(localStorage.getItem('token')));
      setUserEmail(localStorage.getItem('email'))
      setUserPicture(localStorage.getItem('picture'))
      setIsSignedIn(true);
      gisLoaded();
      gapiLoaded();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {isSignedIn && (
        <>
          <Head>
            <title>
              {title}
            </title>
          </Head>
          <div>
            <Sidebar />
            <div data-theme="dark">
              <NavbarDashboard userPicture={userPicture} handleSignOut={() => handleSignOut(setUserToken, setUserEmail, setUserPicture)} />
              <div className="mx-2 md:ml-80 pb-5 md:mr-5 text-white">
                {props.children}
                <FooterDashboard />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
