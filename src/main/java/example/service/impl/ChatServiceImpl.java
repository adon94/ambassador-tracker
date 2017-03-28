package example.service.impl;

import example.dao.ChatDAO;
import example.model.Chat;
import example.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatDAO chatDAO;

    @Autowired
    public ChatServiceImpl(ChatDAO chatDAO) {
        this.chatDAO = chatDAO;
    }

    @Override
    public Chat create(Chat chat) throws Exception {

        return chatDAO.save(chat);
    }

    @Override
    public Chat jobChat(Chat chat) throws Exception {

        if (chat.getJob() != null) {
            List<Chat> chats = chatDAO.findByJob(chat.getJob());
            if (!chats.isEmpty()) {
                return chats.get(0);
            } else {
                return chatDAO.save(chat);
            }
        } else {
            return chatDAO.save(chat);
        }
    }

    @Override
    public List<Chat> findByParticipants(Long id) throws Exception {
        return chatDAO.findByParticipantsId(id);
    }

    @Override
    public Chat findOne(Long id) throws Exception {
        return chatDAO.findOne(id);
    }
}
