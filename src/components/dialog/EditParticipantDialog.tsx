import { type Participant } from "@prisma/client";
import Input from "components/Input";
import { useForm } from "react-hook-form";
import { trpc } from "utils/trpc";

import Dialog from "./Dialog";

interface FormProps {
  name: string;
  email: string;
}

interface EditParticipantDialogProps {
  participant?: Participant;
  open: boolean;
  onClose: () => void;
}

const EditParticipantDialog: React.FC<EditParticipantDialogProps> = (props) => {
  const { register, handleSubmit } = useForm<FormProps>();
  const utils = trpc.useContext();
  const update = trpc.admin.upsertParticipant.useMutation({
    onSuccess: () => {
      props.onClose();
      utils.admin.participants.invalidate();
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    update.mutate({
      participantId: props.participant?.id,
      ...data,
    });
  });

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      title={props.participant ? "Edit Participant" : "Create Participant"}
      primaryButtonText={props.participant ? "Update" : "Create"}
      onSubmit={onSubmit}
    >
      <form
        className="mt-4 flex flex-col space-y-2"
        onSubmit={async (e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="flex flex-row items-center justify-between space-x-4">
          <label htmlFor="name">Name</label>
          <Input
            type="text"
            defaultValue={props.participant?.name}
            {...register("name", { required: true })}
          />
        </div>
        <div className="flex flex-row items-center justify-between space-x-4">
          <label htmlFor="name">Email</label>
          <Input
            type="email"
            defaultValue={props.participant?.email}
            {...register("email", { required: true })}
          />
        </div>
        <input type="submit" className="hidden" />
      </form>
    </Dialog>
  );
};

export default EditParticipantDialog;
