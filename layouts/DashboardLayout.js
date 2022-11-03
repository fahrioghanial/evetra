// components
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FooterDashboard from "../components/Dashboard/FooterDashboard";
import NavbarDashboard from "../components/Dashboard/NavbarDashboard";
import Sidebar from "../components/Dashboard/Sidebar";

// Google Cloud Project Client ID
const CLIENT_ID = `${process.env.NEXT_PUBLIC_CLIENT_ID}`;

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

let tokenClient;

export default function DashboardLayout(props) {
  const router = useRouter();
  const [userToken, setUserToken] = useState({});
  const [userEmail, setUserEmail] = useState("");
  const [userPicture, setUserPicture] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  function checkSession() {
    // const token = gapi.client.getToken();
    // if (token !== null) {
    if (localStorage.getItem('expiration') < Date.now()) {
      localStorage.clear();
      setUserToken({});
      setUserEmail("");
      setUserPicture("");
      console.log('token expired');
      alert('Sesi Habis!, Silakan masuk kembali');
      router.reload("/");
    }
    // }
  }

  function handleSignOut() {
    const token = gapi.client.getToken();
    if (token !== null) {
      console.log("Signed Out")
      // google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      localStorage.clear();
      setUserToken({});
      setUserEmail("");
      setUserPicture("");
      router.push("/");
    }
  }

  function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
  }

  async function initializeGapiClient() {
    await gapi.client.init({
      // apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    if (localStorage.getItem('token') != null) {
      gapi.client.setToken(JSON.parse(localStorage.getItem('token')));
      console.log("token sent from localstorage:", gapi.client.getToken());
    }
  }

  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });
  }


  useEffect(() => {
    if (localStorage.getItem('expiration') != null) {
      setTimeout(checkSession, (localStorage.getItem('expiration') - Date.now()))
    }
    if (localStorage.getItem('token') == null) {
      router.push("/");
    } else if (localStorage.getItem('expiration') > Date.now()) {
      console.log('token still valid');
      console.log('token time remaining (in second):', (localStorage.getItem('expiration') - Date.now()) / 1000)
      // console.log("local storage:", localStorage.getItem('token'));
      setUserToken(JSON.parse(localStorage.getItem('token')));
      setUserEmail(localStorage.getItem('email'))
      setUserPicture(localStorage.getItem('picture'))
      setIsSignedIn(true);
      gisLoaded();
      gapiLoaded();
    }
  }, [])

  const title = `Evetra ${props.title != null ? " - " + props.title : ""}`

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
              <NavbarDashboard userPicture={userPicture} handleSignOut={handleSignOut} />
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
