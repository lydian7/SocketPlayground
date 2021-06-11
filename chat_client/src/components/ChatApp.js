import { logDOM } from "@testing-library/dom";
import { findAllByAltText } from "@testing-library/dom";
import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import Request from "../services/request";

const ChatApp = () => {
  
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // const [fetchedMessages, setFetchedMessages] = useState([]);
  const [msgReceived, setMsgReceived] = useState(false);
  
  let sock;
  let stompClient;
  let username = null;
  const request = new Request();

  const connect = () => {
    return new Promise((resolve, reject) => {
      sock = new SockJS("http://localhost:8080/ws");
      stompClient = Stomp.over(sock);
      stompClient.connect({}, onConnected);
    })
  };

  const fetchAllMessages = () => {
    request.getAll().then((messages) => setMessages(messages));
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    console.log("this is the received message",message);
    setMessages([...messages, message]); // ====> messages display if set on receipt, no showing all seems to skip some
    setMsgReceived(!msgReceived);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    connect().then(() => {
      console.log("resolved");
      const newMessage = {
        content: event.target.message.value.trim(),
        sender: null,
      };
  
      request.post(newMessage);
  
      const message = event.target.message.value.trim();
      // setInputMessage(message);
      
      console.log("this is the message right before it's sent :", message)
  
      if (message && stompClient) {
        var chatMessage = {
          sender: username,
          content: message,
          type: "CHAT",
        };
        stompClient.send("/app/sendMessage", {}, JSON.stringify(chatMessage));
        console.log("this is the sent message", chatMessage)
        // setMessages([...messages, message]); ==> doesnt work
        event.target.message.value = "";
      }
      
      event.target.message.value = "";
    }
    );

  };

  const onConnected = () => {
    stompClient.subscribe("/topic/public", onMessageReceived);
    stompClient.send(
      "/app/addUser",
      {},
      JSON.stringify({ sender: username, type: "JOIN" })
    );
  };

  // useEffect(() => {

  // },[])

  // useEffect(() => {
  //   connect();
  // }, [inputMessage]);

  useEffect(() => {
    fetchAllMessages();
  }, [msgReceived])

  // console.log(messages);

  let messageList = [];
  if (messages) {
    messageList = messages.map((msg, index) => {
      return <li key={index}>{msg.content}</li>;
    });
  }

  return (
    <>
      <form action="" onSubmit={sendMessage}>
        <input type="text" name="message" value={inputMessage}
        onChange = {(e) => setInputMessage(e.target.value)}
        />
        <input type="submit"/>
      </form>
      <ul>
        {messageList ? messageList : null}
        <li>{}</li>
      </ul>
    </>
  );
};

export default ChatApp;
