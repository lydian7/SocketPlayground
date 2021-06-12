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
  const [connected, setConnected] = useState(false);
  const [msgReceived, setMsgReceived] = useState(false);
  const [stompy, setStompy] = useState({});
  const [msgSent, setMsgSent] = useState(false);

  let sock = new SockJS("http://localhost:8080/ws");
  let stompClient;
  let username = null;
  const request = new Request();

  const connect = async () => {
      // const sock = new SockJS("http://localhost:8080/ws");
      stompClient = Stomp.over(sock);
      stompClient.connect({}, onConnected); 
      // setConnected(true);
      console.log("socket is connected :", connected)
      setStompy(stompClient);
  };

  const onConnected = () => {
    stompClient.subscribe("/topic/public", onMessageReceived);
    setConnected(true);
    stompClient.send(
      "/app/addUser",
      {},
      JSON.stringify({ sender: username, type: "JOIN" })
    );
    console.log("on connected the stompClient is:", stompClient)
  };


  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    console.log("this is the received message",message);
    setMessages([...messages, message]); // ====> messages display if set on receipt, no showing all seems to skip some
    setMsgReceived(!msgReceived);
    console.log(msgReceived)
  };

  // function connect() {

  //   var socket = new SockJS('http://localhost:8080/ws');

  //   stompClient = Stomp.over(socket);

  //   stompClient.connect({}, function (frame){

  //       // setConnected(true);
  //       console.log('Connected: ' + frame);

  //       stompClient.subscribe('/topic/greetings', onMessageReceived);

  //       stompClient.send(
  //         "/app/addUser",
  //         {},
  //         JSON.stringify({ sender: username, type: "JOIN" })
  //       );
  //   })
  // }

  const fetchAllMessages = () => {
    request.getAll().then((messages) => setMessages(messages));
  };

  const sendMessage =  (event) => {
    stompClient = stompy;
    event.preventDefault();
      // console.log("resolved");
      const newMessage = {
        content: event.target.message.value.trim(),
        sender: null,
      };
      request.post(newMessage);
      const message = event.target.message.value.trim();
      // setInputMessage(message);
      // console.log("this is the message right before it's sent :", message)
      // console.log("1 if sock is open:", sock.readyState)
      console.log("stompClient before if check in Send msg:", stompClient) 
      // console.log("stompState before IF check in SEND MSG:", stompy)
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
        setMsgSent(!msgSent);
      }
      event.target.message.value = "";
      setMsgReceived(!msgReceived)
  };



  // useEffect(() => {
  // },[])

  useEffect(() => {
    connect();
  },[]);

  useEffect(() => {
    fetchAllMessages();
  },[msgReceived])

  useEffect(() => {
    fetchAllMessages();
  },[msgSent])

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
        <input type="text" name="message" 
        // onChange = {(e) => setInputMessage(e.target.value)}
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
