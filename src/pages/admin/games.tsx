import { type NextPage } from "next";
import AdminLayout from "components/layouts/AdminLayout";
import EditableTable from "components/EditableTable";
import { trpc } from "utils/trpc";
import { formatTime } from "components/date-time";

const AdminGamePage: NextPage = () => {
  const { isLoading, data } = trpc.admin.listGames.useQuery();

  return (
    <AdminLayout>
      <h1 className="text-xl">Game Management</h1>
      <EditableTable
        items={data}
        columnNames={["Game", "Home Team", "Away Team", "Time"]}
        loading={isLoading}
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
