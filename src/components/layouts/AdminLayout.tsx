import React from "react";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";

const AdminLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { status } = useSession();

  const content = () => {
    if (status === "loading") {
      return <div>Loading...</div>;
    }

    if (status === "unauthenticated") {
      return (
        <div>
          <div>You need to be signed in to view this page.</div>
          <div className="mt-4">
            <button
              className="rounded bg-blue-400 py-1 px-2 text-white"
              onClick={() => signIn("google")}
            >
              Sign in{" "}
            </button>
          </div>
        </div>
      );
    }

    return children;
  };

  return (
    <>
      <Head>
        <title>Bowl Pickem Admin</title>
      </Head>
      <div>{content()}</div>
    </>
  );
};

export default AdminLayout;
