const mongoose = require("mongoose");

async function connectDb() {
  let uri = process.env.MONGO_URI;

  mongoose.set("strictQuery", true);

  if (!uri) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MONGO_URI is required");
    }

    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mem = await MongoMemoryServer.create();
    uri = mem.getUri();
  }

  await mongoose.connect(uri, {
    autoIndex: process.env.NODE_ENV !== "production",
  });

  return mongoose.connection;
}

module.exports = { connectDb };

