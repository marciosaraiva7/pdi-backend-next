// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import User from "../../../models/user";

type Data = {
  msg: string;
};

const register = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === "POST") {
    console.log(req.body);
    // const { name, email, password, confirmpassword } = body;
    const body = req.body;
    const name = body.name;
    const email = body.email;
    const password = body.password;
    const confirmpassword = body.confirmpassword;

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

    const userExists = await User.findOne({ email: email });

    if (userExists) {
      return res.status(422).json({ msg: "Utilize outro email" });
    }

    //create password

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //create user

    const user = new User({
      name,
      email,
      password: passwordHash,
    });
    try {
      await user.save();

      res.status(201).json({ msg: "usuario criado com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "Aconteceu algum erro no servidor, tente novamente mais tarde!",
      });
    }
  }
};
