import Image from "next/image";
import React from "react";

import FootballLogo from "../../public/images/football-logo.png";

const Loading: React.FC = () => {
  return (
    <div className="animate-pulse">
      <Image src={FootballLogo.src} alt="Football" width={96} height={62} />
    </div>
  );
};

export default Loading;
