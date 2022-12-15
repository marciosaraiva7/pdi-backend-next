// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  msg: string;
};

export default function welcome(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ msg: "bem vindo a nossa API!" });
}
