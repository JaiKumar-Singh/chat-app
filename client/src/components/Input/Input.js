import React from "react";

import "./Input.css";

const Input = ({ selectFile, setMessage, sendMessage, message }) => (
  <form className="form">
    <input
      className="input"
      type="text"
      placeholder="Say something..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
    />
    <input
      id="file-input"
      className="input"
      onChange={selectFile}
      type="file"
    />
    <button className="sendButton" onClick={(e) => sendMessage(e)}>
      Send
    </button>
  </form>
);

export default Input;
