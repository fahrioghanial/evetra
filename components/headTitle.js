import Head from "next/head";

export default function HeadTitle(props) {
  const title = `Evetra ${props.title != null ? " - " + props.title : ""}`
  return (
    <div>
      <Head>
        <title>
          {title}
        </title>
      </Head>
    </div>
  );
}
