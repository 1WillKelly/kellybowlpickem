import { type NextPage } from "next";
import AdminLayout from "components/layouts/AdminLayout";
import EditableTable from "components/EditableTable";
import { trpc } from "utils/trpc";
import { formatTime } from "components/date-time";
import { useState } from "react";
import { type GameWithTeam } from "types/admin-types";
import EditGameDialog from "components/dialog/EditGameDialog";

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
          game.homeTeam.name,
          game.homePointValue,
          game.awayTeam.name,
          game.awayPointValue,
          formatTime(game.startDate),
        ]}
      />
    </AdminLayout>
  );
};

export default AdminGamePage;
