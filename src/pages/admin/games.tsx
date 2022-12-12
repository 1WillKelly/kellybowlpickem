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

  return (
    <AdminLayout>
      <h1 className="text-xl">Game Management</h1>
      {editingGame && (
        <EditGameDialog
          game={editingGame}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
      <EditableTable
        items={data}
        columnNames={["Game", "Home Team", "Away Team", "Time"]}
        loading={isLoading}
        editItem={(game) => {
          setEditingGame(game);
          setDialogOpen(true);
        }}
        renderItem={(game) => [
          game.name,
          game.homeTeam.name,
          game.awayTeam.name,
          formatTime(game.startDate),
        ]}
      />
    </AdminLayout>
  );
};

export default AdminGamePage;
