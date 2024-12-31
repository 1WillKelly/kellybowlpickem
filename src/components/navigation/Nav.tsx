import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { api } from "utils/trpc";
import FootballLogoMark from "../../assets/images/football.svg";
import styles from "./index.module.scss";

const NavItems = [
  { title: "Individual Standings", url: "/" },
  { title: "Team Standings", url: "/teams" },
];

const AdminNavItems = [
  { title: "Games", url: "/admin/games" },
  { title: "Participants", url: "/admin/participants" },
  { title: "Teams", url: "/admin/teams" },
  { title: "Picks", url: "/admin/picks" },
];

const Nav: React.FC = () => {
  const { pathname } = useRouter();
  const { data: session } = useSession();
  const { data: isAdmin } = api.admin.isAdmin.useQuery(undefined, {
    retry: false,
    enabled: !!session,
  });

  return (
    <>
      <nav className={styles["primary-nav"]}>
        <Link href="/">
          <Image
            src={FootballLogoMark.src}
            alt="Football"
            width={41}
            height={26}
            className={styles["logo-mark"]}
          />
        </Link>
        <ul>
          {NavItems.map(({ title, url }) => (
            <li key={url}>
              <Link
                href={url}
                className={` ${styles["nav-item"]} ${
                  pathname === url ? styles.active : styles.inactive
                }`}
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {session?.user && isAdmin?.ok && (
        <div className={styles["external-admin-nav"]}>
          <p>{session.user?.email} (Admin)</p>
          <ul>
            {AdminNavItems.map(({ title, url }) => (
              <li key={url}>
                <Link href={url}>{title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Nav;
