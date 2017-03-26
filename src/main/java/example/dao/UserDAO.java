package example.dao;

import example.model.User;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
public interface UserDAO extends CrudRepository<User, Long> {
    List<User> findByEmail(String email);
    List<User> findByFirstName(String firstName);
    List<User> findByManager(boolean manager);
}
