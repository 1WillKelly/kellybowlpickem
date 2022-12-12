import Input from "components/Input";
import { useForm } from "react-hook-form";
import { type GameWithTeam } from "types/admin-types";
import { trpc } from "utils/trpc";

import Dialog from "./Dialog";

interface EditGameDialogProps {
  game: GameWithTeam;
  open: boolean;
  onClose: () => void;
}

interface FormProps {
  name: string;
  homePointValue?: number;
  awayPointValue?: number;
}

const EditGameDialog: React.FC<EditGameDialogProps> = (props) => {
  const { register, handleSubmit } = useForm<FormProps>();
  const utils = trpc.useContext();
  const updateGame = trpc.admin.updateGame.useMutation({
    onSuccess: () => {
      props.onClose();
      utils.admin.listGames.invalidate();
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    updateGame.mutate({
      gameId: props.game.id,
      name: data.name,
      homePointValue:
        data.homePointValue && !isNaN(data.homePointValue)
          ? data.homePointValue
          : undefined,
      awayPointValue:
        data.awayPointValue && !isNaN(data.awayPointValue)
          ? data.awayPointValue
          : undefined,
    });
  });

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      title="Edit Game"
      primaryButtonText="Save"
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
            className="w-[400px]"
            {...register("name")}
            defaultValue={props.game.name ?? undefined}
          />
        </div>
        <div className="flex flex-row items-center justify-between space-x-4">
          <label htmlFor="name">Home Point Value</label>
          <Input
            type="number"
            {...register("homePointValue", { valueAsNumber: true })}
            defaultValue={props.game.homePointValue ?? undefined}
          />
        </div>
        <div className="flex flex-row items-center justify-between space-x-4">
          <label htmlFor="name">Away Point Value</label>
          <Input
            type="number"
            {...register("awayPointValue", { valueAsNumber: true })}
            defaultValue={props.game.awayPointValue ?? undefined}
          />
        </div>
        <input type="submit" className="hidden" />
      </form>
    </Dialog>
  );
};

export default EditGameDialog;
