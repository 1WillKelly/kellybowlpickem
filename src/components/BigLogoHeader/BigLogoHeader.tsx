import Image from "next/image";
import React from "react";

import BigLogo from "../../assets/images/bowlpickem-logo.svg";
import styles from "./index.module.scss";

const BigLogoHeader: React.FC = () => (
  <section
    className={`
      ${styles["big-logo-header"]}
      flex w-full items-center justify-center py-14 pt-8
  `}
  >
    <Image
      src={BigLogo.src}
      alt="Kelly Bowl Pick'em"
      width={390}
      height={160}
      className={styles["big-logo"]}
    />
  </section>
);

export default BigLogoHeader;
