import { type NextApiRequest, type NextApiResponse } from "next";
import { webhookAuth } from "./auth";

const syncBowlGames = async (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    ok: true,
  });
};

export default webhookAuth(syncBowlGames);
