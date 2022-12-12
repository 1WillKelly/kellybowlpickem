import { type NextPage } from "next";
import { useState } from "react";

import { trpc } from "utils/trpc";
import { type ParticipantTeam } from "@prisma/client";
import AdminLayout from "components/layouts/AdminLayout";
import EditableTable from "components/EditableTable";
import Button from "components/Button";
import EditParticipantTeamDialog from "components/dialog/EditParticipantTeamDialog";
import DeleteParticipantTeamDialog from "components/dialog/DeleteParticipantTeamDialog";

import { type TeamWithParticipants } from "types/admin-types";

const AdminTeamPage: NextPage = () => {
  const { isLoading, data } = trpc.adminTeams.teams.useQuery();

  const [editingTeam, setEditingTeam] = useState<
    TeamWithParticipants | undefined
  >();
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

      {createDialogOpen && (
        <EditParticipantTeamDialog
          open={true}
          onClose={() => setCreateDialogOpen(false)}
        />
      )}
      {editingTeam && (
        <EditParticipantTeamDialog
          open={editDialogOpen}
          team={editingTeam}
          onClose={() => setEditDialogOpen(false)}
        />
      )}
      {deletingTeam && (
        <DeleteParticipantTeamDialog
          open={deleteDialogOpen}
          team={deletingTeam}
          onClose={() => {
            setDeleteDialogOpen(false);
            setDeletingTeam(undefined);
          }}
        />
      )}
      <EditableTable
        items={data?.teams}
        columnNames={["Name", "Members"]}
        loading={isLoading}
        editItem={(team) => {
          setEditingTeam(team);
          setEditDialogOpen(true);
        }}
        renderItem={(team) => [
          team.name,
          team.members.map((m) => m.participant.name).join(" "),
        ]}
        deleteItem={(team) => {
          setDeletingTeam(team);
          setDeleteDialogOpen(true);
        }}
      />
    </AdminLayout>
  );
};

export default AdminTeamPage;
