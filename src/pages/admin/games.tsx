import { type NextPage } from "next";
import AdminLayout from "components/layouts/AdminLayout";
import EditableTable from "components/EditableTable";
import { trpc } from "utils/trpc";
import { formatTime } from "components/date-time";
import { useState } from "react";
import { type GameWithTeam } from "types/admin-types";
import EditGameDialog from "components/dialog/EditGameDialog";
import Image from "next/image";
import { type FootballTeam } from "@prisma/client";

interface TeamCellProps {
  team: FootballTeam;
}

const TeamCell: React.FC<TeamCellProps> = ({ team }) => {
  return (
    <div key={team.id} className="flex flex-row items-center space-x-2">
      {team.logo && (
        <Image
          alt={team.name}
          className="rounded-full"
          width={20}
          height={20}
          src={team.logo}
        />
      )}
      <div>{team.name}</div>
    </div>
  );
};

const AdminGamePage: NextPage = () => {
  const { isLoading, data } = trpc.admin.listGames.useQuery();

  const [editingGame, setEditingGame] = useState<GameWithTeam | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const formatName = (game: GameWithTeam) => {
    if (!game.homePointValue || !game.awayPointValue) {
      return <span className="border-b-2 border-red-600">{game.name}</span>;
    }

    return game.name;
  };

  return (
    <AdminLayout>
      <h1 className="text-xl">
        Game Management {data?.season && `(${data?.season.displayName})`}
      </h1>
      {editingGame && (
        <EditGameDialog
          key={editingGame.id}
          game={editingGame}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
      <EditableTable
        items={data?.matchups}
        columnNames={[
          "Game",
          "Home Team",
          "Home Points",
          "Away Team",
          "Away Points",
          "Time",
        ]}
        loading={isLoading}
        editItem={(game) => {
          setEditingGame(game);
          setDialogOpen(true);
        }}
        renderItem={(game) => [
          formatName(game),
          <TeamCell key={game.homeTeam.id} team={game.homeTeam} />,
          game.homePointValue,
          <TeamCell key={game.awayTeam.id} team={game.awayTeam} />,
          game.awayPointValue,
          formatTime(game.startDate),
        ]}
      />
    </AdminLayout>
  );
};

export default AdminGamePage;
