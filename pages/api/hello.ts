// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cors from "cors";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  cors({ origin: "http://127.0.0.1:5173/?" });
  res.status(200).json({ name: "John Doe" });
}
