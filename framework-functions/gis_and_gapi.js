import axios from 'axios';
import Router from 'next/router';
import PocketBase from 'pocketbase';

// connect to PocketBase SDK
const client = new PocketBase(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

// Google Cloud Project Client ID
const CLIENT_ID = `${process.env.NEXT_PUBLIC_CLIENT_ID}`;

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = `${process.env.NEXT_PUBLIC_DISCOVERY_DOC}`;

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = `${process.env.NEXT_PUBLIC_SCOPES}`;

let tokenClient;

export function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

export async function initializeGapiClient() {
  await gapi.client.init({
    // apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  if (localStorage.getItem('token') != null) {
    gapi.client.setToken(JSON.parse(localStorage.getItem('token')));
    // console.log("token sent from localstorage:", gapi.client.getToken());
  }
}

export function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
}

// Function for handling sign in
export const handleSignIn = (e) => {
  e.preventDefault();
  if (tokenClient == null) {
    gisLoaded()
  }
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }


    // console.log("Token Created: ", gapi.client.getToken());
    localStorage.setItem('token', JSON.stringify(gapi.client.getToken()));
    localStorage.setItem('expiration', Date.now() + gapi.client.getToken().expires_in * 1000)
    // localStorage.setItem('expiration', Date.now() + 15 * 1000)
    axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${gapi.client.getToken().access_token}`)
      .then((response) => {
        const records = client.records.getFullList('auth_logging', 200 /* batch size */, {
          sort: '-created',
        });
        records.then((res) => {
          let isUserExist = false;
          res.map((res) => {
            if (res.user == response.data.email) {
              isUserExist = true;
            }
          })
          if (!isUserExist) {
            const data = {
              user: response.data.email,
              name: response.data.name
            };
            const record = client.records.create('auth_logging', data);
          }
        })
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('name', response.data.name);
        localStorage.setItem('picture', response.data.picture);
        Router.push("/dashboard");
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

export function checkSession(setUserToken, setUserEmail, setUserPicture) {
  if (localStorage.getItem('expiration') < Date.now()) {
    localStorage.clear();
    setUserToken({});
    setUserEmail("");
    setUserPicture("");
    // console.log('token expired');
    alert('Sesi Habis!, Silakan masuk kembali');
    Router.reload("/");
  }
}

export function handleSignOut(setUserToken, setUserEmail, setUserPicture) {
  const token = gapi.client.getToken();
  if (token !== null) {
    // console.log("Signed Out")
    // google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    localStorage.clear();
    setUserToken({});
    setUserEmail("");
    setUserPicture("");
    Router.push("/");
  }
}