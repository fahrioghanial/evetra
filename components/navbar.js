import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PocketBase from 'pocketbase';
import { useEffect, useState } from 'react';

// connect to PocketBase SDK
const client = new PocketBase(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);


export default function Navbar() {
  const router = useRouter();

  const CLIENT_ID = `${process.env.NEXT_PUBLIC_CLIENT_ID}`;

  // Discovery doc URL for APIs used by the quickstart
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  const SCOPES = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

  let tokenClient;

  function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
  }

  async function initializeGapiClient() {
    await gapi.client.init({
      // apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
  }

  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });
  }

  // Function for handling sign in
  const handleSignIn = (e) => {
    e.preventDefault();
    if (tokenClient == null) {
      gisLoaded()
    }
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw (resp);
      }

      console.log("Token Created: ", gapi.client.getToken());
      localStorage.setItem('token', JSON.stringify(gapi.client.getToken()));
      localStorage.setItem('expiration', Date.now() + gapi.client.getToken().expires_in * 1000)
      // localStorage.setItem('expiration', Date.now() + 15 * 1000)
      axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${gapi.client.getToken().access_token}`)
        .then((response) => {
          console.log(response.data.email)
          console.log(response.data.picture)
          localStorage.setItem('email', response.data.email);
          localStorage.setItem('picture', response.data.picture);
          router.push("/dashboard");
        });
    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  useEffect(() => {
    gisLoaded();
    gapiLoaded();
  }, [])

  return (
    <>
      <div className="navbar bg-primary">
        <div className="flex-1 ">
          <Link href={"/"}>
            <a className="w-48">
              <img className="" src="/logo.png" alt="Evetra" />
            </a>
          </Link>
        </div>
        <div className="flex-none">
          <a className="btn bg-white text-black hover:bg-slate-400 border-0 flex gap-2" onClick={handleSignIn}>
            {/* <span> */}
            <img src="/logo-google.png" alt="Google" />
            {/* </span> */}
            <span className="md:block hidden">
              Masuk dengan Akun Google
            </span>
          </a>
        </div>
      </div>
    </>
  )
}