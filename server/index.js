const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

const { addUser, removeUser, getUser, getUsersInRoom } = require("./user");
const router = require("./router");
const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
  console.log("We have a new connection!");

  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);

    socket.emit("message", {
      user: "bot",
      text: `${user.name}, welcome to ${user.room} chat room.`,
    });
    socket.broadcast.to(user.room).emit("message", {
      user: "bot",
      text: `${user.name}, has joined the chat.`,
    });
    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", { user: user.name, text: message }); // check again
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "bot",
        text: `${user.name} left the chat.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

app.use(cors());
app.use(router);

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
