import { type Participant, type Season } from "@prisma/client";
import { type GameWithTeam } from "types/admin-types";

interface CSVPickImportProps {
  csvData: string;
  games: readonly GameWithTeam[];
  season: Season;
  participants: readonly Participant[];
}

const CSVPickImport: React.FC<CSVPickImportProps> = (props) => {
  return (
    <div>
      {props.csvData.split("\n").map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
};

export default CSVPickImport;
