import React from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import AdminNav from "components/navigation/AdminNav";
import FullScreenLoginForm from "components/forms/FullScreenLoginForm";

const AdminLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { status } = useSession();

  const content = () => {
    if (status === "loading") {
      return <div>Loading...</div>;
    }

    if (status === "unauthenticated") {
      return <FullScreenLoginForm />;
    }

    return (
      <div className="min-h-screen bg-gray-100">
        <AdminNav />
        <div className="mt-6 px-6">{children}</div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Bowl Pickem Admin</title>
      </Head>
      {content()}
    </>
  );
};

export default AdminLayout;
