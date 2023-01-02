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

type SyncStatus = "unsynced" | "syncing" | "synced";

const AdminNav: React.FC = () => {
  const { pathname } = useRouter();
  const utils = trpc.useContext();

  const [gameSyncStatus, setGameSyncStatus] = useState<SyncStatus>("unsynced");
  const [scoresSyncStatus, setScoresSyncStatus] =
    useState<SyncStatus>("unsynced");
  const [championshipSyncStatus, setChampionshipSyncStatus] =
    useState<SyncStatus>("unsynced");

  const syncGamesMutation = trpc.admin.syncGames.useMutation({
    onError: () => setGameSyncStatus("unsynced"),
    onSuccess: () => {
      utils.admin.listGames.invalidate();
      setGameSyncStatus("synced");
    },
  });
  const syncScoresMutation = trpc.admin.syncScores.useMutation({
    onError: () => setScoresSyncStatus("unsynced"),
    onSuccess: () => {
      utils.admin.listGames.invalidate();
      setScoresSyncStatus("synced");
    },
  });
  const syncChampionshipMutation = trpc.admin.syncChampionship.useMutation({
    onError: () => setChampionshipSyncStatus("unsynced"),
    onSuccess: () => {
      setChampionshipSyncStatus("synced");
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
              setScoresSyncStatus("syncing");
              syncScoresMutation.mutate();
            }}
            primary={false}
            secondary
            disabled={scoresSyncStatus === "syncing"}
          >
            {scoresSyncStatus == "syncing"
              ? "Syncing..."
              : scoresSyncStatus === "synced"
              ? "Scores Synced"
              : "Sync Scores"}
          </Button>
          <Button
            onClick={() => {
              setGameSyncStatus("syncing");
              syncGamesMutation.mutate();
            }}
            primary={false}
            secondary
            disabled={gameSyncStatus === "syncing"}
          >
            {gameSyncStatus === "syncing"
              ? "Syncing..."
              : gameSyncStatus === "synced"
              ? "Games Synced"
              : "Sync Games"}
          </Button>

          <Button
            onClick={() => {
              setChampionshipSyncStatus("syncing");
              syncChampionshipMutation.mutate();
            }}
            primary={false}
            secondary
            disabled={championshipSyncStatus === "syncing"}
          >
            {championshipSyncStatus === "syncing"
              ? "Syncing..."
              : championshipSyncStatus === "synced"
              ? "Championship Synced"
              : "Sync Championship"}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
