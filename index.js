const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");

const peerserver = ExpressPeerServer(server, {
  debug: true,
});
app.use(express.static("public"));

app.set("view engine", "ejs");
app.use("/peerjs", peerserver);
app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:roomId", (req, res) => {
  const Id = req.params.roomId;
  res.render("home", { roomId: Id });
});

io.on("connection", (socket) => {
  socket.on("join-room", (data) => {
    socket.join(data.Room_Id);
    const count = io.engine.clientsCount;
    const userData = {
      id : data.id,
      participant : count
    }
    // console.log(data.id);
    socket.broadcast.to(data.Room_Id).emit("user-connected", userData);
    socket.on("disconnect", () => {
      socket.broadcast.to(data.Room_Id).emit("user-disconnected" , data.id);
    });
  });
});
server.listen(3001);
