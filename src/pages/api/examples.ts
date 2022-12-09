import { type NextApiRequest, type NextApiResponse } from "next";

import { CFBDataSource } from "../../server/datasources/college-football-data-api";

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = new CFBDataSource();
  const huskyStats = await client.makeRequest("/stats/season", {
    year: 2022,
    team: "Washington",
  });
  res.status(200).json({
    huskyStats,
  });
};

export default examples;
