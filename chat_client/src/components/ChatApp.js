import { findAllByAltText } from "@testing-library/dom";
import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const ChatApp = () => {
  
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  
  let sock;
  let stompClient;
  let username = null;

  const connect = () => {
    sock = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(sock);
    stompClient.connect({}, onConnected);
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    console.log(message);
    setMessages([...messages, message.content]);
  };

  console.log(messages);

  const sendMessage = (event) => {
    event.preventDefault();
    const message = event.target.message.value.trim();
    if (message && stompClient) {
      var chatMessage = {
        sender: username,
        content: message,
        type: "CHAT",
      };
    }
    stompClient.send("/app/sendMessage", {}, JSON.stringify(chatMessage));

    event.target.message.value = "";
  };

  const onConnected = () => {
    stompClient.subscribe("/topic/public", onMessageReceived);
    stompClient.send(
      "/app/addUser",
      {},
      JSON.stringify({ sender: username, type: "JOIN" })
    );
  };

  const messageList = messages.map((msg, index) => {
    return <li key={index}>{msg}</li>;
  });

  useEffect(() => {
    connect();
  }, [inputMessage]);

  return (
    <>
      <form action="" onSubmit={sendMessage}>
        <input
          type="text"
          value={inputMessage}
          name="message"
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <input type="submit" />
      </form>
      <ul>{messageList}</ul>
    </>
  );
};

export default ChatApp;
