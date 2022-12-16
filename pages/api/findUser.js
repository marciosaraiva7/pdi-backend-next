import connect from "../../utils/connectDB";

export default async function handler(req, res) {
  const { db } = await connect();

  const user = {
    name: req.body.name,
  };
  const response = await db.collection("users").findOne(user);

  res.status(200).json(response);
}
