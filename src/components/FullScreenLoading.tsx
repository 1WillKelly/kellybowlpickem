import React from "react";
import Loading from "./Loading";

const FullScreenLoading: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Loading />
    </div>
  );
};

export default FullScreenLoading;
