import PlausibleProvider from "next-plausible";

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
      <html lang="en">
        <body>{children}</body>
      </html>
    </PlausibleProvider>
  );
}
