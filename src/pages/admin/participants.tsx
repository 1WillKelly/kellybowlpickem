import { type NextPage } from "next";
import AdminLayout from "components/layouts/AdminLayout";

import { trpc } from "utils/trpc";
import EditableTable from "components/EditableTable";
import { useState } from "react";
import { type ParticipantWithTeam } from "types/admin-types";
import Button from "components/Button";
import EditParticipantDialog from "components/dialog/EditParticipantDialog";

const AdminParticipantPage: NextPage = () => {
  const { isLoading, data } = trpc.admin.participants.useQuery();
  const [editingParticipant, setEditingParticipant] = useState<
    ParticipantWithTeam | undefined
  >();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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
      <div className="flex justify-between">
        <h1 className="text-xl">Participants</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          Add Participant
        </Button>
      </div>
      <EditableTable
        items={data?.participants}
        columnNames={["Name", "Email"]}
        loading={isLoading}
        renderItem={(participant) => [participant.name, participant.email]}
        editItem={(participant) => {
          setEditingParticipant(participant);
          setEditDialogOpen(true);
        }}
      />
    </AdminLayout>
  );
};

export default AdminParticipantPage;
