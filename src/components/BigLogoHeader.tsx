import Image from "next/image";
import React from "react";

import BigLogo from "../assets/images/bowlpickem-logo.svg";

const BigLogoHeader: React.FC = () => (
  <section className="flex w-full items-center justify-center py-14 px-4">
    <Image
      src={BigLogo.src}
      alt="Kelly Bowl Pick'em"
      width={390}
      height={160}
    />
  </section>
);

export default BigLogoHeader;
