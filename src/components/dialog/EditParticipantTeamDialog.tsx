import { type ParticipantTeam } from "@prisma/client";
import Input from "components/Input";
import { useForm } from "react-hook-form";
import { trpc } from "utils/trpc";

import Dialog from "./Dialog";

interface FormProps {
  name: string;
}

interface EditParticipantDialogProps {
  team?: ParticipantTeam;
  open: boolean;
  onClose: () => void;
}

const EditParticipantDialog: React.FC<EditParticipantDialogProps> = (props) => {
  const { register, handleSubmit } = useForm<FormProps>();
  const utils = trpc.useContext();
  const update = trpc.adminTeams.upsertTeam.useMutation({
    onSuccess: () => {
      props.onClose();
      utils.adminTeams.teams.invalidate();
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    update.mutate({
      teamId: props.team?.id,
      ...data,
    });
  });

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      title={props.team ? "Edit Team" : "Create Team"}
      primaryButtonText={props.team ? "Update" : "Create"}
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
            defaultValue={props.team?.name}
            {...register("name", { required: true })}
          />
        </div>
        <input type="submit" className="hidden" />
      </form>
    </Dialog>
  );
};

export default EditParticipantDialog;
