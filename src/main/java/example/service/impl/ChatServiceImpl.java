package example.service.impl;

import example.dao.ChatDAO;
import example.model.Chat;
import example.model.User;
import example.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatDAO chatDAO;

    @Autowired
    public ChatServiceImpl(ChatDAO chatDAO) {
        this.chatDAO = chatDAO;
    }

    @Override
    public Chat create(Chat chat) throws Exception {
        Date d = new Date();
        Timestamp t = new Timestamp(d.getTime());
        chat.setUpdatedAt(t);

        return chatDAO.save(chat);
    }

    @Override
    public Chat jobChat(Chat chat) throws Exception {

        if (chat.getJob() != null) {
            List<Chat> chats = chatDAO.findByJob(chat.getJob());
            if (!chats.isEmpty()) {
                return chats.get(0);
            } else {
                Date d = new Date();
                Timestamp t = new Timestamp(d.getTime());
                chat.setUpdatedAt(t);
                return chatDAO.save(chat);
            }
        } else {
            Date d = new Date();
            Timestamp t = new Timestamp(d.getTime());
            chat.setUpdatedAt(t);
            return chatDAO.save(chat);
        }
    }

    @Override
    public Chat userChat(Chat chat) throws Exception {
        Long userId = chat.getParticipants().get(0).getId();

        List<Chat> chats = chatDAO.findByParticipantsId(userId);
        if (!chats.isEmpty()) {
            Chat usersChat = null;
            for (Chat c : chats) {
                if (c.getJob() == null) {
                    User userA = c.getParticipants().get(0);
                    User userB = c.getParticipants().get(1);
                    if (Objects.equals(userA.getId(), userId) || Objects.equals(userB.getId(), userId)) {
                        usersChat = c;
                    }
                }
            }
            if (usersChat != null) {
                return usersChat;
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
