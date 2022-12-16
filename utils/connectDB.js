import { MongoClient } from "mongodb";

const url = process.env.NEXT_PUBLIC_MONGODB_URI;

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function connect() {
  await client.connect();

  const db = client.db("test");

  return { db, client };
}
