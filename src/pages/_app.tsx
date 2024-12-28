import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import PlausibleProvider from "next-plausible";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <PlausibleProvider
        domain="kellybowlpickem.com"
        customDomain="https://plausible.ndella.com"
      >
        <Component {...pageProps} />
      </PlausibleProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
