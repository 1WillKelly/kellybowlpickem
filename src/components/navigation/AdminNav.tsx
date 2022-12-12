import { useRouter } from "next/router";
import React from "react";

const NavItems = [
  { title: "Participants", url: "/participants" },
  { title: "Picks", url: "/picks" },
];

const AdminNav: React.FC = () => {
  const router = useRouter();
  return <div className="bg-white shadow-md"></div>;
};

export default AdminNav;
