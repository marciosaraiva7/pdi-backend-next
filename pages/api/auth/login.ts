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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);

  const { db } = await connect();

  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  if (!user.email) {
    return res.status(422).json({
      message: "o email é obrigatório!",

      token: "sem email" + req.body.email,
    });
  }
  if (!user.password) {
    return res.status(422).json({
      message: "a senha é obrigatória!",
      token: undefined,
    });
  }

  const responseProfile = await db
    .collection("users")
    .findOne({ email: user.email });
  if (!responseProfile) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  const checkPassword = await bcrypt.compare(
    user.password,
    responseProfile.password
  );

  if (!checkPassword) {
    return res
      .status(422)
      .json({ message: "Senha inválida", token: undefined });
  }

  try {
    const secret: string = process.env.NEXT_PUBLIC_SECRET ?? "";
    const token = jwt.sign(
      {
        id: responseProfile._id,
      },
      secret
    );
    res.status(200).json({
      message: "Autenticação realizada com sucesso!",
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Aconteceu algum erro no servidor, tente novamente mais tarde!",
      token: undefined,
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
