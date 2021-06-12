package com.ChatAppTest.chat_service.components;

import com.ChatAppTest.chat_service.models.ChatMessage;
import com.ChatAppTest.chat_service.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements ApplicationRunner {
    @Autowired
    MessageRepository messageRepository;

    public DataLoader() {
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
//        ChatMessage chat1 = new ChatMessage();
//        messageRepository.save(chat1);
    }
}
