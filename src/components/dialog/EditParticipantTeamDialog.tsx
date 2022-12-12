import Input from "components/Input";
import { useForm } from "react-hook-form";
import { type TeamWithParticipants } from "types/admin-types";
import { trpc } from "utils/trpc";

import Dialog from "./Dialog";

interface FormProps {
  name: string;
}

interface AddParticipantFormProps {
  name: string;
}

interface EditParticipantDialogProps {
  team?: TeamWithParticipants;
  open: boolean;
  onClose: () => void;
}

const EditParticipantDialog: React.FC<EditParticipantDialogProps> = (props) => {
  const { register, handleSubmit } = useForm<FormProps>();
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAddForm,
  } = useForm<AddParticipantFormProps>();
  const utils = trpc.useContext();

  const { data: participantData } =
    trpc.adminParticipants.participants.useQuery();

  const update = trpc.adminTeams.upsertTeam.useMutation({
    onSuccess: () => {
      props.onClose();
      utils.adminTeams.teams.invalidate();
    },
  });

  const addTeamMember = trpc.adminTeams.addParticipantToTeam.useMutation({
    onSuccess: () => {
      resetAddForm();
      utils.adminTeams.teams.invalidate();
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    update.mutate({
      teamId: props.team?.id,
      ...data,
    });
  });

  const submitAddParticipant = handleSubmitAdd((data) => {
    if (!props.team) {
      return;
    }
    const participant = participantData?.participants.find(
      (p) => p.name === data.name
    );
    if (!participant) {
      console.error("No participant found by that name", data.name);
      return;
    }
    addTeamMember.mutate({
      participantId: participant.id,
      teamId: props.team.id,
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
      {props.team && (
        <div className="mt-4">
          <div className="text-left">
            {props.team?.members.length && <p className="font-bold">Members</p>}
            {props.team?.members.map((m) => (
              <div key={m.id}>{m.participant.name}</div>
            ))}
          </div>
          <form
            className="mt-4 flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              submitAddParticipant();
            }}
          >
            <Input
              type="text"
              list="participants-search"
              placeholder="Search for participant to add..."
              {...registerAdd("name")}
            />
            <datalist id="participants-search">
              {participantData?.participants.map((participant) => (
                <option key={participant.id} value={participant.name} />
              ))}
            </datalist>
          </form>
        </div>
      )}
    </Dialog>
  );
};

export default EditParticipantDialog;
