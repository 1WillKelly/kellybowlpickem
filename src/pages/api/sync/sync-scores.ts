import { type NextApiRequest, type NextApiResponse } from "next";
import { syncScores } from "server/sync/scores";
import { webhookAuth } from "./auth";

export const maxDuration = 30; // This function can run for a maximum of 5 seconds

const syncScoresEndpoint = async (
  _req: NextApiRequest,
  res: NextApiResponse
) => {
  const now = new Date();
  // December on January
  if (now.getMonth() !== 11 && now.getMonth() !== 0) {
    res.status(200).json({
      ok: true,
      message: "Skipped because out of bowl season",
    });
    return;
  }

  const synced = await syncScores();
  res.status(200).json({
    synced,
    ok: true,
  });
};

export default webhookAuth(syncScoresEndpoint);
