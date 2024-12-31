import { type Participant } from "@prisma/client";
import { api } from "utils/trpc";

import Dialog from "./Dialog";

interface DeleteParticipantDialogProps {
  participant: Participant;
  open: boolean;
  onClose: () => void;
}

const DeleteParticipantDialog: React.FC<DeleteParticipantDialogProps> = (
  props
) => {
  const utils = api.useUtils();

  const deleteParticipant = api.adminParticipants.deleteParticipant.useMutation(
    {
      onSuccess: () => {
        props.onClose();
        utils.adminParticipants.participants.invalidate();
      },
    }
  );

  const onSubmit = () => {
    deleteParticipant.mutate({
      participantId: props.participant.id,
    });
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      title="Delete participant"
      primaryButtonText="Delete"
      onSubmit={onSubmit}
    >
      <p>
        Are you sure you want to delete{" "}
        <span className="font-bold">{props.participant.name}</span>?
      </p>
    </Dialog>
  );
};

export default DeleteParticipantDialog;
