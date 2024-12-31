import PlausibleProvider from "next-plausible";
import { TRPCReactProvider } from "utils/trpc";

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlausibleProvider
      domain="kellybowlpickem.com"
      customDomain="https://plausible.ndella.com"
    >
      <TRPCReactProvider>
        <html lang="en">
          <body>{children}</body>
        </html>
      </TRPCReactProvider>
    </PlausibleProvider>
  );
}
