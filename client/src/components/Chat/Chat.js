import React, { useEffect, useState } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState();

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io("localhost:5000");
    setName(name);
    setRoom(room);

    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
    console.log(users);
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (file) {
      const messageObject = {
        type: "file",
        file,
        fileName: message,
      };
      socket.emit("sendMessage", messageObject, () => {
        setMessage("");
        setFile();
      });
    } else if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };
  const selectFile = (e) => {
    if (typeof e.target.files[0] !== "undefined") {
      setMessage(e.target.files[0].name);
      setFile(e.target.files[0]);
    } else {
      return null;
    }
  };
  console.log(message, messages);
  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          selectFile={selectFile}
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
        {/* <TextContainer users={users} /> */}
      </div>
    </div>
  );
};

export default Chat;
