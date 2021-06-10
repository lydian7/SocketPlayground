package com.ChatAppTest.chat_service.repositories;

import com.ChatAppTest.chat_service.models.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<ChatMessage, Long> {
}
