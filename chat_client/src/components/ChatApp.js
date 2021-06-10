import { logDOM } from "@testing-library/dom";
import { findAllByAltText } from "@testing-library/dom";
import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import Request from "../services/request";

const ChatApp = () => {
  
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  
  let sock;
  let stompClient;
  let username = null;
  const request = new Request();

  const connect = () => {
    sock = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(sock);
    stompClient.connect({}, onConnected);
    console.log("connect called");
  };

  const fetchAllMessages = () => {
    request.getAll().then((messages) => setMessages(messages));
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    console.log(message);
  };

  console.log(messages);

  const sendMessage = (event) => {
    event.preventDefault();
    const newMessage = {
      content: event.target.message.value,
      sender: null,
    };

    request.post(newMessage);

    const message = event.target.message.value.trim();

    if (message && stompClient) {
      var chatMessage = {
        sender: username,
        content: message,
        type: "CHAT",
      };
      stompClient.send("/app/sendMessage", {}, JSON.stringify(chatMessage));
    }
    setMessages([...messages, newMessage]);
  };

  const onConnected = () => {
    stompClient.subscribe("/topic/public", onMessageReceived);
    stompClient.send(
      "/app/addUser",
      {},
      JSON.stringify({ sender: username, type: "JOIN" })
    );
  };

  useEffect(() => {
    connect();
  }, [messages]);

  useEffect(() => {
    fetchAllMessages();
  }, []);
  console.log(messages);
  let messageList = [];
  if (messages) {
    messageList = messages.map((msg, index) => {
      return <li key={index}>{msg.content}</li>;
    });
  }

  return (
    <>
      <form action="" onSubmit={sendMessage}>
        <input type="text" name="message" />
        <input type="submit" />
      </form>
      <ul>
        {messageList ? messageList : null}
        <li>{}</li>
      </ul>
    </>
  );
};

export default ChatApp;
