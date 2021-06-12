import { logDOM } from "@testing-library/dom";
import { findAllByAltText } from "@testing-library/dom";
import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import Request from "../services/request";

const ChatApp = () => {

  
  const [messages, setMessages] = useState([]);
  const [msgReceived, setMsgReceived] = useState(false);
  const [stompy, setStompy] = useState({});
  const [listMsgs, setListMsgs] = useState([]);

  
  let stompClient;
  let username = null;
  const request = new Request();

  const connect = async () => {
    const sock = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(sock);
    stompClient.connect({}, onConnected);
    setStompy(stompClient);
  };

  const onConnected = () => {
    stompClient.subscribe("/topic/public", onMessageReceived);
    stompClient.send(
      "/app/addUser",
      {},
      JSON.stringify({ sender: username, type: "JOIN" })
    );
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    fetchAllMessages();
    setMessages([...listMsgs, message]); // 
  };

  const fetchAllMessages = () => {
    request.getAll().then((messages) => setMessages(messages));
  };

  const sendMessage = (event) => {

    stompClient = stompy;
    event.preventDefault();
    
    const newMessage = {
      content: event.target.message.value.trim(),
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
      console.log("this is the sent message", chatMessage);
      
      event.target.message.value = "";
    }
    event.target.message.value = "";
    fetchAllMessages();
  };

  useEffect(() => {
    connect();
    fetchAllMessages();
  }, []);

  let messageList = [];

  if (messages) {
    messageList = messages.map((msg, index) => {
      return <li key={index}>{msg.content}</li>;
    });
  }

  const newListMessages = listMsgs.map((msg, index) => {
    return <li key={index}>{msg.content}</li>;
  });

  return (
    <>
      <form action="" onSubmit={sendMessage}>
        <input
          type="text"
          name="message"
        />
        <input type="submit" />
      </form>
      {/* <ul>{messageList ? messageList : fetchAllMessages()}</ul> */}
      <ul>
        {messageList}
        {listMsgs}
      </ul>
    </>
  );
};
export default ChatApp;
