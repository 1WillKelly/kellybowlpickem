import { type NextPage } from "next";
import AdminLayout from "components/layouts/AdminLayout";
import { trpc } from "utils/trpc";
import EditableTable from "components/EditableTable";
import { type ParticipantTeam } from "@prisma/client";
import { useState } from "react";
import Button from "components/Button";

const AdminTeamPage: NextPage = () => {
  const { isLoading, data } = trpc.adminTeams.teams.useQuery();

  const [editingTeam, setEditingTeam] = useState<ParticipantTeam | undefined>();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTeam, setDeletingTeam] = useState<
    ParticipantTeam | undefined
  >();

  return (
    <AdminLayout>
      <div className="flex justify-between">
        <h1 className="text-xl">Team Management</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>Add Team</Button>
      </div>

      <EditableTable
        items={data?.teams}
        columnNames={["Name"]}
        loading={isLoading}
        editItem={(team) => {
          setEditingTeam(team);
          setEditDialogOpen(true);
        }}
        renderItem={(team) => [team.name]}
        deleteItem={(team) => {
          setDeletingTeam(team);
          setDeleteDialogOpen(true);
        }}
      />
    </AdminLayout>
  );
};

export default AdminTeamPage;
