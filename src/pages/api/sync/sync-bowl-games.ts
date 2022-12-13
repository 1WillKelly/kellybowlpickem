import { type NextApiRequest, type NextApiResponse } from "next";
import { syncBowlGames } from "server/sync/season";
import { webhookAuth } from "./auth";

const syncBowlGamesEndpoint = async (
  _req: NextApiRequest,
  res: NextApiResponse
) => {
  await syncBowlGames();
  res.status(200).json({
    ok: true,
  });
};

export default webhookAuth(syncBowlGamesEndpoint);
