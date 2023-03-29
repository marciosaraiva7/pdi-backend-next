import { NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import connect from "../../../utils/connectDB";

type Data = {
  message: String;
  token?: Object;
};

const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function checkToken(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acesso negado!" });
  }

  try {
    const secret: string = process.env.NEXT_PUBLIC_SECRET ?? "";
    jwt.verify(token, secret);
    res.status(200).json({ message: "Token válido" });
  } catch (err) {
    res.status(400).json({ message: "Token inválido" });
  }
}
