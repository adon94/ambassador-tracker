package example.service.impl;

import example.dao.NotificationDAO;
import example.model.Notification;
import example.model.User;
import example.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationDAO notificationDAO;

    @Autowired
    public NotificationServiceImpl(NotificationDAO notificationDAO) {
        this.notificationDAO = notificationDAO;
    }

    @Override
    public List<Notification> saveMultiple(List<Notification> notifications) throws Exception {
        return notificationDAO.save(notifications);
    }

    @Override
    public List<Notification> findByUser(User user) throws Exception {
        return notificationDAO.findByUser(user);
    }
}
