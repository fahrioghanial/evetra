import Head from "next/head";

export default function HeadTitle(props) {
  return (
    <div>
      <Head>
        <title>
          Evetra {props.title != null ? " - " + props.title : ""}
        </title>
      </Head>
    </div>
  );
}
