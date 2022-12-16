import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import FootballLogoMark from "../../assets/images/football.svg";
import styles from "./index.module.scss";

const NavItems = [
  { title: "Individual Standings", url: "/" },
  { title: "Team Standings", url: "/teams" },
];

const Nav: React.FC = () => {
  const { pathname } = useRouter();
  return (
    <nav className={styles["primary-nav"]}>
      <Link href="/">
        <Image
          src={FootballLogoMark.src}
          alt="Football"
          width={41}
          height={26}
        />
      </Link>
      <ul>
        {NavItems.map(({ title, url }) => (
          <li>
            <Link
              href={url}
              key={url}
              className={` ${styles["nav-item"]} ${
                pathname === url ? styles.active : ""
              }`}
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
