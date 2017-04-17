package example.service.impl;

import example.dao.ChatDAO;
import example.dao.NotificationDAO;
import example.model.Chat;
import example.model.Message;
import example.model.Notification;
import example.model.User;
import example.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
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

    private NotificationDAO notificationDAO;

    @Autowired
    public void setNotificationDAO(NotificationDAO notificationDAO) {
        this.notificationDAO = notificationDAO;
    }

    @Override
    public Chat create(Chat chat) throws Exception {
        Date d = new Date();
        Timestamp t = new Timestamp(d.getTime());
        chat.setUpdatedAt(t);

        List<Notification> notifications = new ArrayList<>();

        Message message = chat.getMessages().get(chat.getMessages().size() - 1);

        for (User user : chat.getParticipants()) {
            if (!Objects.equals(user.getId(), message.getSender().getId())) {
                Notification notification = new Notification();
                notification.setTimestamp(t);
                notification.setSender(message.getSender());
                notification.setChat(chat);
                notification.setType("message");
                notification.setMessage(message.getText());
                notification.setSeen(false);
                notification.setUser(user);
                notifications.add(notification);
            }
        }

        Chat returnChat = chatDAO.save(chat);
        notificationDAO.save(notifications);

        return returnChat;
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
        Long userId1 = chat.getParticipants().get(0).getId();
        Long userId2 = chat.getParticipants().get(1).getId();

        List<Chat> chats = chatDAO.findByParticipantsId(userId1);
        if (!chats.isEmpty()) {
            Chat usersChat = null;
            for (Chat c : chats) {
                if (c.getJob() == null) {
                    User userA = c.getParticipants().get(0);
                    User userB = c.getParticipants().get(1);
                    if (Objects.equals(userA.getId(), userId2) || Objects.equals(userB.getId(), userId2)) {
                        usersChat = c;
                    }
                }
            }
            if (usersChat != null) {
                return usersChat;
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
    public List<Chat> findByParticipants(Long id) throws Exception {
        return chatDAO.findByParticipantsId(id);
    }

    @Override
    public Chat findOne(Long id) throws Exception {
        return chatDAO.findOne(id);
    }
}
