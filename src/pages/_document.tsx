import { Head, Html, Main, NextScript } from "next/document";

function MyDocument() {
  return (
    <Html>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-512x512.png" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default MyDocument;
