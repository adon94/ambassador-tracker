package example.service;

import example.model.Chat;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ChatService {
    Chat create(Chat chat) throws Exception;
    Chat jobChat(Chat chat) throws Exception;
    List<Chat> findByParticipants(Long id) throws Exception;
    Chat findOne(Long id) throws Exception;
}
