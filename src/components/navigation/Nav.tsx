import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import FootballLogo from "../../../public/images/football-logo.png";
import styles from './index.module.scss'

const NavItems = [
  { title: "Games", url: "/admin/games" },
  { title: "Participants", url: "/admin/participants" },
];

const Nav: React.FC = () => {
  const { pathname } = useRouter();
  return (
    <nav className="flex h-16 flex-row bg-white px-6 shadow-md w-full">
      <div className="flex items-center">
        <Image src={FootballLogo.src} alt="Football" width={48} height={31} />
      </div>
      <div className={styles['another-test']}>
        Test
      </div>
      <div className="ml-6 flex space-x-8">
        {NavItems.map(({ title, url }) => (
          <Link
            href={url}
            key={url}
            className={`text-blue inline-flex items-center border-b-2 px-1 pt-1 ${
              pathname === url
                ? "border-indigo-500 font-medium text-gray-900"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            {title}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Nav;
