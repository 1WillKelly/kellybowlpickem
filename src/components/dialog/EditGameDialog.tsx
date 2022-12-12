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
        onSubmit={async (e) => {
          e.preventDefault();
          onSubmit();
        }}
      ></form>
    </Dialog>
  );
};

export default EditGameDialog;
