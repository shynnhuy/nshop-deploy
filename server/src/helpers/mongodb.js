const mongoose = require("mongoose");
const { MONGODB_URI, DB_NAME } = require("../config");
const { success, error } = require("consola");

// mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, {
  dbName: DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

mongoose.connection.on("connected", () => {
  success({
    message: `Connected to MongoDB`,
    badge: true,
  });
});

mongoose.connection.on("error", (err) => {
  error({
    message: `Connect to MongoDB error: ${err.message}`,
    badge: true,
  });
});

mongoose.connection.on("disconnected", () => {
  error({
    message: `Mongoose connection is disconnected.`,
    badge: true,
  });
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
