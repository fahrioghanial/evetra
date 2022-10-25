/* eslint-disable react/no-children-prop */
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import PocketBase from 'pocketbase';
import jwt_decode from 'jwt-decode';

// Layout
import MainLayout from "../layouts/MainLayout";
import { useRouter } from "next/router";
import Script from "next/script";

// connect to PocketBase SDK
const client = new PocketBase(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

export default function TestAuth() {
  const router = useRouter();
  const [provider, setProvider] = useState([]);

  const CLIENT_ID = '572609338065-lt6j8a5uha0gv5sjatfa3rbncina7oo4.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyBmPFt7821LaTOpOKVbAA6WJuaMwecUI_I';
  const CLIENT_SECRET = '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';

  // Discovery doc URL for APIs used by the quickstart
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  const SCOPES = 'https://www.googleapis.com/auth/calendar';

  let tokenClient;
  let responseJWT;
  let gapiInited = false;
  let gisInited = false;

  // document.getElementById('authorize_button').style.visibility = 'hidden';
  // document.getElementById('signout_button').style.visibility = 'hidden';
  // document.getElementById('createevent_button').style.visibility = 'hidden';

  /**
       * Callback after api.js is loaded.
       */
  function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
  }

  /**
   * Callback after the API client is loaded. Loads the
   * discovery doc to initialize the API.
   */
  async function initializeGapiClient() {
    await gapi.client.init({
      // apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
  }

  /**
   * Callback after Google Identity Services are loaded.
   */
  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
  }

  /**
   * Enables user interaction after all libraries are loaded.
   */
  function maybeEnableButtons() {
    if (gapiInited && gisInited) {
      document.getElementById('authorize_button').style.visibility = 'visible';
    }
  }

  /**
   *  Sign in the user upon button click.
   */
  function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw (resp);
      }

      console.log("gapi.client.getToken: ", gapi.client.getToken())
      console.log("resp authorization: ", resp)
      // document.getElementById('signout_button').style.visibility = 'visible';
      // document.getElementById('createevent_button').style.visibility = 'visible';
      // document.getElementById('authorize_button').innerText = 'Refresh';
      await listUpcomingEvents();
      // await createEvent();
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

  /**
   *  Sign out the user upon button click.
   */
  function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      document.getElementById('content').innerText = '';
      document.getElementById('authorize_button').innerText = 'Authorize';
      document.getElementById('signout_button').style.visibility = 'hidden';
      document.getElementById('createevent_button').style.visibility = 'hidden';
    }
  }

  function handleCreateEventClick() {
    createEvent();
  }

  /**
   * Print the summary and start datetime/date of the next ten events in
   * the authorized user's calendar. If no events are found an
   * appropriate message is printed.
   */
  async function listUpcomingEvents() {
    let response;
    try {
      const request = {
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime',
      };
      response = await gapi.client.calendar.events.list(request);
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }

    const events = response.result.items;
    if (!events || events.length == 0) {
      document.getElementById('content').innerText = 'No events found.';
      return;
    }
    // Flatten to string to display
    const output = events.reduce(
      (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
      'Events:\n');
    document.getElementById('content').innerText = output;
  }

  async function createEvent() {
    try {
      const event = {
        'summary': 'Test Create Event',
        'location': 'Unpad, Jatinangor',
        'description': 'Test create event using GCal API',
        'start': {
          'dateTime': '2022-10-20T12:00:00',
          'timeZone': 'Asia/Jakarta'
        },
        'end': {
          'dateTime': '2022-10-20T13:00:00',
          'timeZone': 'Asia/Jakarta'
        },
        // 'recurrence': [
        //   'RRULE:FREQ=DAILY;COUNT=2'
        // ],
        'attendees': [
          // {'email': 'dickyrahmahermawan@gmail.com'},
          // {'email': 'aaaabim@gmail.com'},
          // {'email': 'abdurrahman1270@gmail.com'},
          // {'email': 'windudr@gmail.com'},
          { 'email': 'ghanialfatihah@gmail.com' },
        ],
        'reminders': {
          'useDefault': false,
          'overrides': [
            { 'method': 'email', 'minutes': 23 },
            { 'method': 'popup', 'minutes': 10 }
          ]
        }
      };

      const request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'sendUpdates': 'all',
        'resource': event,
      });

      request.execute(function (event) {
        document.getElementById('event-added').innerHTML = 'Event created: ' + "<a href='" + event.htmlLink + "'>" + event.htmlLink + "</a>";
      });
    } catch (err) {
      document.getElementById('event-added').innerText = err.message;
      return;
    }
  }

  const [user, setUser] = useState({});

  function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    console.log("Decoded: ", jwt_decode(response.credential))
    console.log("response auth: ", response)
    setUser(jwt_decode(response.credential));
    document.getElementById("buttonDiv").hidden = true;
  }

  function handleSignOut(event) {
    setUser({});
    document.getElementById("buttonDiv").hidden = false;
  }


  useEffect(() => {
    // document.getElementById('authorize_button').style.visibility = 'hidden';
    // document.getElementById('signout_button').style.visibility = 'hidden';
    // document.getElementById('createevent_button').style.visibility = 'hidden';

    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }  // customization attributes
    );

    // gisForWebLoaded();
    gisLoaded();
    gapi.load('client', gapiLoaded)
  }, []);

  return (
    <MainLayout>
      <section id="home" className="mt-5">
        <div className="container m-auto p-5 text-white">
          {/* <p>Google Calendar API Quickstart</p> */}
          <button id="authorize_button" onClick={handleAuthClick}>Authorize</button>
          <button id="signout_button" onClick={handleSignoutClick}>Sign Out</button>
          <button id="createevent_button" onClick={handleCreateEventClick}>Create Event</button>
          <pre id="content"></pre>
          <div id="event-added"></div>

          <div id="buttonDiv" onClick={handleAuthClick}></div>
          {Object.keys(user).length != 0 &&
            <button className="btn btn-accent" onClick={(e) => handleSignOut(e)}>Sign Out</button>
          }
          <div>
            {user &&
              <>
                <img src={user.picture} />
                <p>{user.name}</p>
              </>
            }
          </div>
        </div>
      </section>
      {/* <Script async defer src="https://apis.google.com/js/api.js" onLoad={gapiLoaded}></Script>
      <Script async defer src="https://accounts.google.com/gsi/client" onLoad={gisLoaded}></Script> */}
    </MainLayout>
  )
}