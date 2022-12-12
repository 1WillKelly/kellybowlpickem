import { type GameWithTeam } from "types/admin-types";
import Dialog from "./Dialog";

interface EditGameDialogProps {
  game: GameWithTeam;
  open: boolean;
  onClose: () => void;
}

const EditGameDialog: React.FC<EditGameDialogProps> = (props) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      title="Edit Game"
      primaryButtonText="Save"
      cancelButton={false}
    ></Dialog>
  );
};

export default EditGameDialog;
