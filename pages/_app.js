import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import "tailwindcss/tailwind.css";

import { ModalProvider } from "../components/ModalContext";
import { addAmmInfo } from "../utils/helper";
import * as gtag from "../utils/gtag";
import "../utils/style.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [initRPCDone, setInitRPCDone] = useState(false);

  addAmmInfo();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    const init = async () => {
      const RPC = process.env.NEXT_PUBLIC_RPC;
      window.client = await SigningCosmWasmClient.connect(RPC);
      setInitRPCDone(true);
    };
    init();
  }, []);

  return (
    <>
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
      </Head>
      <ModalProvider>
        {initRPCDone ? <Component {...pageProps} /> : null}
      </ModalProvider>
    </>
  );
}

export default MyApp;
