import Head from "next/head";

const HeadMetadata: React.FC = () => {
  return (
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Bowl Pick&apos;em</title>
      <meta name="description" content="Kelly Bowl Pick'em" />
    </Head>
  );
};

export default HeadMetadata;
