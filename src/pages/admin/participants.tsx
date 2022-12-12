import { type NextPage } from "next";
import AdminLayout from "components/layouts/AdminLayout";

import { trpc } from "utils/trpc";
import EditableTable from "components/EditableTable";
import { useState } from "react";
import { type ParticipantWithTeam } from "types/admin-types";
import Button from "components/Button";
import EditParticipantDialog from "components/dialog/EditParticipantDialog";
import { type Participant } from "@prisma/client";
import DeleteParticipantDialog from "components/dialog/DeleteParticipantDialog";

const AdminParticipantPage: NextPage = () => {
  const { isLoading, data } = trpc.adminParticipants.participants.useQuery();
  const [editingParticipant, setEditingParticipant] = useState<
    ParticipantWithTeam | undefined
  >();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingParticipant, setDeletingParticipant] = useState<
    Participant | undefined
  >();

  return (
    <AdminLayout>
      {createDialogOpen && (
        <EditParticipantDialog
          open={true}
          onClose={() => setCreateDialogOpen(false)}
        />
      )}
      {editingParticipant && (
        <EditParticipantDialog
          open={editDialogOpen}
          participant={editingParticipant}
          onClose={() => setEditDialogOpen(false)}
        />
      )}
      {deletingParticipant && (
        <DeleteParticipantDialog
          open={deleteDialogOpen}
          participant={deletingParticipant}
          onClose={() => {
            setDeleteDialogOpen(false);
            setDeletingParticipant(undefined);
          }}
        />
      )}
      <div className="flex justify-between">
        <h1 className="text-xl">Participants</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          Add Participant
        </Button>
      </div>
      <EditableTable
        items={data?.participants}
        columnNames={["Name", "Email", "Team"]}
        loading={isLoading}
        renderItem={(participant) => [
          participant.name,
          participant.email,
          participant.teamMembership?.team.name,
        ]}
        editItem={(participant) => {
          setEditingParticipant(participant);
          setEditDialogOpen(true);
        }}
        deleteItem={(participant) => {
          setDeletingParticipant(participant);
          setDeleteDialogOpen(true);
        }}
      />
    </AdminLayout>
  );
};

export default AdminParticipantPage;
