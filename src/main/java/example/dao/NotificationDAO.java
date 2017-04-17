package example.dao;

import example.model.Chat;
import example.model.Notification;
import example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
public interface NotificationDAO extends JpaRepository<Notification, Long> {
    List<Notification> findByUserInAndTypeIn(User user, String type);
    List<Notification> findByChat(Chat chat);
}
