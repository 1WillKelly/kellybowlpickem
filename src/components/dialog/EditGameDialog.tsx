import { type GameWithTeam } from "types/admin-types";
import Dialog from "./Dialog";
import { useForm } from "react-hook-form";

interface EditGameDialogProps {
  game: GameWithTeam;
  open: boolean;
  onClose: () => void;
}

const EditGameDialog: React.FC<EditGameDialogProps> = (props) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (data) => {});

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      title="Edit Game"
      primaryButtonText="Save"
      onSubmit={onSubmit}
    >
      <form
        className="mt-4"
        onSubmit={async (e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="flex flex-row items-center justify-between space-x-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="w-[400px] border p-2"
            {...register("name")}
            defaultValue={props.game.name ?? undefined}
          />
        </div>
        <div className="flex flex-row items-center justify-between space-x-4">
          <label htmlFor="name">Home Point Value</label>
          <input
            type="number"
            className="border p-2"
            {...register("homePointValue")}
            defaultValue={props.game.homePointValue ?? undefined}
          />
        </div>
        <div className="flex flex-row items-center justify-between space-x-4">
          <label htmlFor="name">Away Point Value</label>
          <input
            type="number"
            className="border p-2"
            {...register("awayPointValue")}
            defaultValue={props.game.awayPointValue ?? undefined}
          />
        </div>
      </form>
    </Dialog>
  );
};

export default EditGameDialog;
