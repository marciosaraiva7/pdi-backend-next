// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import connect from "../../../utils/connectDB";
import Cors from "cors";

type Data = {
  msg: string;
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
  
  if (req.method === "POST") {
    // const { name, email, password, confirmpassword } = body;
    const body = req.body;
    const name = body.name;
    const email = body.email;
    const password = body.password;
    const confirmpassword = body.confirmpassword;
    const photo = body.photo;

    //validations

    if (!name) {
      return res.status(422).json({ msg: "o nome é obrigatório!" });
    }
    if (!email) {
      return res.status(422).json({ msg: "o email é obrigatório!" });
    }
    if (!password) {
      return res.status(422).json({ msg: "a senha é obrigatória!" });
    }

    if (password !== confirmpassword) {
      return res.status(422).json({ msg: "as senhas não conferem!" });
    }

    //check if user exists

    const { db } = await connect();

    const userExists = await db.collection("users").findOne({ email: email });

    if (userExists) {
      return res.status(422).json({ msg: "Utilize outro email" });
    }

    //create password

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //create user

    const user = {
      name,
      email,
      password: passwordHash,
      photo,
    };
    try {
      await db.collection("users").insertOne(user);

      res.status(200).json({ msg: "usuario criado com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "Aconteceu algum erro no servidor, tente novamente mais tarde!",
      });
    }
  }
}
