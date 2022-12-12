import { type NextPage } from "next";
import AdminLayout from "components/layouts/AdminLayout";
import { trpc } from "utils/trpc";

const AdminTeamPage: NextPage = () => {
  const { isLoading, data } = trpc.adminTeams.teams.useQuery();
  return (
    <AdminLayout>
      <div>TODO team management</div>
    </AdminLayout>
  );
};

export default AdminTeamPage;
