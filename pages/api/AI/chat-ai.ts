import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { Configuration, OpenAIApi } from "openai";

type Data = {
  message: any;
  token?: Object;
};

const cors = Cors({
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
  fn: {
    (
      req: Cors.CorsRequest,
      res: {
        statusCode?: number | undefined;
        setHeader(key: string, value: string): any;
        end(): any;
      },
      next: (err?: any) => any
    ): void;
    (arg0: any, arg1: any, arg2: (result: unknown) => void): void;
  }
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function ChatAi(
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
        content: `${sendMessage}`,
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
