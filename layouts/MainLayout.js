import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Components
import Head from "next/head";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

// Framework functions
import { gapiLoaded, gisLoaded, handleSignIn } from "../framework-functions/gis_and_gapi";

export default function MainLayout(props) {
  const router = useRouter();

  const [isSignedIn, setIsSignedIn] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('token') != null) {
      router.push("/dashboard");
    } else {
      gisLoaded();
      gapiLoaded();
      setIsSignedIn(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const title = `Evetra ${props.title != null ? " - " + props.title : ""}`
  return (
    <>
      {!isSignedIn && (
        <>
          <Head>
            <title>
              {title}
            </title>
          </Head>
          <div data-theme="dark" id="app">
            <Navbar handleSignIn={handleSignIn} />
            {props.children}
            <Footer />
          </div>
        </>
      )}
    </>
  )
}