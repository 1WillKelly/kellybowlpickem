import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import Script from "next/script";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      {process.env.NODE_ENV === "production" && (
        <Script
          defer
          src="https://umami.ndella.com/script.js"
          data-website-id="2a130eb1-8e27-4fca-940e-d6ea925d097b"
        />
      )}

      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
