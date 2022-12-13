import { type NextApiRequest, type NextApiResponse } from "next";
import { settlePicks } from "server/sync/settle-picks";
import { webhookAuth } from "./auth";

const settlePicksEndpoint = async (
  _req: NextApiRequest,
  res: NextApiResponse
) => {
  const result = await settlePicks();
  res.status(200).json({
    ok: true,
    result,
  });
};

export default webhookAuth(settlePicksEndpoint);
