import { type NextApiRequest, type NextApiResponse } from "next";

const examples = async (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    ok: true,
  });
};

export default examples;
