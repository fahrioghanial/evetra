import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true' />
        <link href="https://fonts.googleapis.com/css2?family=Manrope&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script src="https://apis.google.com/js/api.js" strategy="beforeInteractive"></Script>
        <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive"></Script>
      </body>
    </Html>
  )
}