import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { trpc } from "utils/trpc";
import Button from "components/Button";
import FootballLogo from "../../../public/images/football-logo.png";

const NavItems = [
  { title: "Games", url: "/admin/games" },
  { title: "Participants", url: "/admin/participants" },
  { title: "Teams", url: "/admin/teams" },
  { title: "Picks", url: "/admin/picks" },
];

const AdminNav: React.FC = () => {
  const { pathname } = useRouter();
  const utils = trpc.useContext();

  const [isSyncingGames, setIsSyncingGames] = useState(false);
  const [isSyncingScores, setIsSyncingScores] = useState(false);
  const [didSyncGames, setDidSyncGames] = useState(false);
  const [didSyncScores, setDidSyncScores] = useState(false);

  const syncGamesMutation = trpc.admin.syncGames.useMutation({
    onSettled: () => setIsSyncingGames(false),
    onSuccess: () => {
      utils.admin.listGames.invalidate();
      setDidSyncGames(true);
    },
  });
  const syncScoresMutation = trpc.admin.syncScores.useMutation({
    onSettled: () => setIsSyncingScores(false),
    onSuccess: () => {
      utils.admin.listGames.invalidate();
      setDidSyncScores(true);
    },
  });

  return (
    <nav className="flex h-16 flex-row bg-white px-6 shadow-md">
      <div className="flex items-center">
        <Link href={"/"}>
          <Image src={FootballLogo.src} alt="Football" width={48} height={31} />
        </Link>
      </div>
      <div className="flex w-full justify-between">
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
        <div className="flex flex-row items-center space-x-4">
          <Button
            onClick={() => {
              setIsSyncingScores(true);
              syncScoresMutation.mutate();
            }}
            primary={false}
            secondary
            disabled={isSyncingScores}
          >
            {isSyncingScores
              ? "Syncing..."
              : didSyncScores
              ? "Scores Synced"
              : "Sync Scores"}
          </Button>
          <Button
            onClick={() => {
              setIsSyncingGames(true);
              syncGamesMutation.mutate();
            }}
            primary={false}
            secondary
            disabled={isSyncingGames}
          >
            {isSyncingGames
              ? "Syncing..."
              : didSyncGames
              ? "Games Synced"
              : "Sync Games"}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
