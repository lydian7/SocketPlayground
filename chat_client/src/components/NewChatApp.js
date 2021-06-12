import React from 'react';
import SockJS from "sockjs-client";

const NewChatApp = () => {

    const socket = new SockJS('http://localhost:8080/ws'); 

    socket.addEventListener('message', async (event) => { 
      const profile = JSON.parse(event.data);
      console.log(profile);
    //   this.state.profiles.push(profile);
    //   this.setState({profiles: this.state.profiles}); 
    });
  
  
    return(

        <p>Websocket test</p>

    )

};

export default NewChatApp;