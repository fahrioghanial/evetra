// Components
import Head from "next/head";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function MainLayout(props) {
  const title = `Evetra ${props.title != null ? " - " + props.title : ""}`
  return (
    <>
      <Head>
        <title>
          {title}
        </title>
      </Head>
      <div data-theme="dark" id="app">
        <Navbar />
        {props.children}
        <Footer />
      </div>
    </>
  )
}