import { type NextApiRequest, type NextApiResponse } from "next";
import { CFBDataSource } from "server/datasources/college-football-data-api";
import { webhookAuth } from "./auth";

const syncBowlGames = async (_req: NextApiRequest, res: NextApiResponse) => {
  const client = new CFBDataSource();
  const games = await client.postSeasonGames(2022);
  res.status(200).json({
    games,
  });
};

export default webhookAuth(syncBowlGames);
