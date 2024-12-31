import CSVPickImport from "components/import/CSVPickImport";
import AdminLayout from "components/layouts/AdminLayout";
import { type NextPage } from "next";
import { type ChangeEvent, useState } from "react";
import { api } from "utils/trpc";

const AdminPicksPage: NextPage = () => {
  const { data: gamesData } = api.admin.listGames.useQuery();
  const { data: participantData } =
    api.adminPicks.participantsWithPicks.useQuery();

  const [loadedFile, setLoadedFile] = useState<string | undefined>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.length && e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", (e) => {
      if (e.target?.result) {
        setLoadedFile(e.target.result.toString());
      }
    });
    reader.readAsBinaryString(file);
  };

  return (
    <AdminLayout>
      <h1 className="text-xl">Picks Management</h1>
      <form action="#" className="mx-auto max-w-xl">
        <div className="flex justify-between">
          <label htmlFor="csvUpload">Select CSV of pick data</label>
          <input
            id="csvUpload"
            type="file"
            accept="text/csv"
            onChange={handleFileChange}
          />
        </div>
      </form>
      {loadedFile && gamesData && participantData && (
        <CSVPickImport
          csvData={loadedFile}
          games={gamesData.matchups}
          season={gamesData.season}
          participants={participantData.participants}
        />
      )}
    </AdminLayout>
  );
};

export default AdminPicksPage;
