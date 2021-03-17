require("dotenv").config();
require("./src/helpers/mongodb");
require("./src/helpers/redis");

const socketIO = require("socket.io");

const createError = require("http-errors");

const { success } = require("consola");

require("./src/models/User");
require("./src/models/Category");
require("./src/models/Shop");
require("./src/models/Product");
const app = require("./src/app");
app.disable("etag");

const port = process.env.PORT;

app.use(async (req, res, next) => {
  next(createError.NotFound("API endpoint doesn't exist"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    status: err.status || 500,
    message: err.message || "Server Error",
  });
});

const server = app.listen(port, () =>
  success({
    message: `Server running on port ${port}`,
    badge: true,
  })
);
const io = socketIO(server);
io.on("connection", function (socket) {
  // log("User " + chalk.green(socket.id) + " connected");
  success({
    message: "User " + socket.id + " connected",
    badge: true,
  });
  socket.on("sendMessage", function (msg) {
    console.log("message: " + msg);
    io.emit("newMsg", msg);
  });
  socket.on("change_request_status", function (status) {
    io.emit("onchange_request_status", status);
  });
  socket.on("disconnect", function () {
    console.log("User Disconnected");
  });
});
