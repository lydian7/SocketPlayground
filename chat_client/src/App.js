import logo from "./logo.svg";
import "./App.css";
import React from "react";
import ChatApp from "./components/ChatApp";
import NewChatApp from "./components/NewChatApp"


function App() {
  return (
    <div className="App">
      <ChatApp />
      {/* <NewChatApp/> */}
    </div>
  );
}

export default App;
