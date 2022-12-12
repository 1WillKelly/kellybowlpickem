import Button from "components/Button";
import { signIn } from "next-auth/react";
import React from "react";

const FullScreenLoginForm: React.FC = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="text-center text-lg">
        You need to be signed in to view this page.
      </div>
      <div className="mt-4">
        <Button onClick={() => signIn("google")}>Sign in </Button>
      </div>
    </div>
  );
};

export default FullScreenLoginForm;
