import React from "react";
import { socket } from "../socket";

const ConnectionManager = () => {
  function connect() {
    socket.connect();
  }
  function disconnect() {
    socket.disconnect();
  }

  return <div></div>;
};

export default ConnectionManager;
