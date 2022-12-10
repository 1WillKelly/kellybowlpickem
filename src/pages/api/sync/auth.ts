import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

import { env } from "env/server.mjs";

export type ApiFunction = (
  req: NextApiRequest,
  res: NextApiResponse
) => void | Promise<void>;

const reject = (res: NextApiResponse, message: string) => {
  console.warn("Invalid auth header for webhook:", message);
  res.status(403).json({
    message: "authentication failed",
  });
};

export const webhookAuth = (handler: ApiFunction): ApiFunction => {
  // Development
  if (!env.WEBHOOK_SECRET) {
    return handler;
  }

  const webhookSecret = Buffer.from(env.WEBHOOK_SECRET);
  return (req, res) => {
    const tokenHeader = req.headers["authentication"];
    if (tokenHeader === undefined || typeof tokenHeader !== "string") {
      reject(res, "authentication header not provided");
      return;
    }

    const tokenParts = tokenHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "token") {
      reject(res, `malformed auth header: ${tokenHeader}`);
      return;
    }

    if (!tokenParts[1] || tokenParts[1].length !== webhookSecret.length) {
      reject(res, `mismatched token length: ${tokenHeader}`);
      return;
    }

    if (!crypto.timingSafeEqual(Buffer.from(tokenParts[1]), webhookSecret)) {
      reject(res, `invalid auth header for webhook: ${tokenParts[1]}`);
      return;
    }
    handler(req, res);
  };
};
