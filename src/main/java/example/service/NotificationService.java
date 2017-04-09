package example.service;

import example.model.Notification;
import example.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface NotificationService {
    List<Notification> saveMultiple(List<Notification> notifications) throws Exception;
    List<Notification> findByUser(User user) throws Exception;
}
