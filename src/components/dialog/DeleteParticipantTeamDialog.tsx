import { type ParticipantTeam } from "@prisma/client";
import { api } from "utils/trpc";

import Dialog from "./Dialog";

interface DeleteParticipantTeamDialogProps {
  team: ParticipantTeam;
  open: boolean;
  onClose: () => void;
}

const DeleteParticipantTeamDialog: React.FC<
  DeleteParticipantTeamDialogProps
> = (props) => {
  const utils = api.useUtils();

  const deleteParticipantTeam = api.adminTeams.deleteTeam.useMutation({
    onSuccess: () => {
      props.onClose();
      utils.adminTeams.teams.invalidate();
    },
  });

  const onSubmit = () => {
    deleteParticipantTeam.mutate({
      teamId: props.team.id,
    });
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      title="Delete Team"
      primaryButtonText="Delete"
      onSubmit={onSubmit}
    >
      <p>
        Are you sure you want to delete{" "}
        <span className="font-bold">{props.team.name}</span>?
      </p>
    </Dialog>
  );
};

export default DeleteParticipantTeamDialog;
