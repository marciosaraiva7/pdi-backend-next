import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import { coaching, references } from "./coach.json";

type Data = {
  message: any;
  token?: Object;
};

const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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

export default async function chatAI(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);

  const sendMessage = `${req.body.message}`;
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `${coaching} ${sendMessage}`,
      },
    ],
  });

  const messages = completion.data.choices[0].message;

  try {
    res.status(200).json({ message: messages });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Ocorreu um erro, contacte ao desenvolvedor" });
  }
}

// fetch("api/auth/checkToken", {
//   method: "POST",
//   headers: {
//     Authorization: `Bearer ${req.headers["authorization"]}`,
//     "Content-Type": "application/json",
//   },
// }).then((resp) => resp.json())
