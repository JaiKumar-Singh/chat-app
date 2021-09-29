import React from "react";

import "./Message.css";
import Image from "../Image";
import ReactEmoji from "react-emoji";

const Message = ({ message: { text, user }, name }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }
  if (text.type === "file") {
    const blob = new Blob([text.file], { type: text.type });
    if (isSentByCurrentUser) {
      return (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{name}</p>
          <div>
            <Image fileName={text.fileName} blob={blob} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="messageContainer justifyStart">
          <div>
            <Image fileName={text.fileName} blob={blob} />
          </div>
          <p className="sentText pl-10 ">{name}</p>
        </div>
      );
    }
  }
  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{trimmedName}</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
      </div>
      <p className="sentText pl-10 ">{user}</p>
    </div>
  );
};

export default Message;
