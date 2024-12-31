import Head from "next/head";
import { seasonDisplayName } from "utils/datetime";

const HeadMetadata: React.FC = () => {
  const seasonName = seasonDisplayName();

  return (
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={`Kelly Bowl Pick'em ${seasonName}`} />
    </Head>
  );
};

export default HeadMetadata;
