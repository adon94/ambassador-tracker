package example.dao;

import example.model.Notification;
import example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
public interface NotificationDAO extends JpaRepository<Notification, Long> {
    List<Notification> findByUser(User user);
}
