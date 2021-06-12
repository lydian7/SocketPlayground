package com.ChatAppTest.chat_service.controllers;

import com.ChatAppTest.chat_service.models.ChatMessage;
import com.ChatAppTest.chat_service.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Controller
@RestController
public class ChatController {
    @Autowired
    MessageRepository messageRepository;

    @GetMapping(value = "/messages")
    public ResponseEntity<List<ChatMessage>> getAllMessages(){
        return new ResponseEntity(messageRepository.findAll(), HttpStatus.OK);
    }

     @PostMapping(value = "/messages")
     public ResponseEntity postMessage(@RequestBody ChatMessage message){
        messageRepository.save(message);
        return new ResponseEntity(message, HttpStatus.OK);
     }

    @MessageMapping("/sendMessage") //all messages sent from client to here will be re-directed to below route
    @SendTo("/topic/public") //sends a message to the /topic/public url that stomp is subscribed to
    public ChatMessage sendMessage(@Payload ChatMessage message){
        return message;
//        return ("This is what returns from server when you send a message");
    }

    @MessageMapping("addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage message, SimpMessageHeaderAccessor headerAccessor){
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        return message;
    }

}
