package example.service;

import example.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {

    ResponseEntity<User> create(User user) throws Exception;
    User admin() throws Exception;
    User update(User user) throws Exception;
    User generateCode(User user) throws Exception;
    User findOne(Long id) throws Exception;
    List<User> findAll() throws Exception;
    List<User> findByManager(boolean manager) throws Exception;
    boolean remove(Long id) throws Exception;
    ResponseEntity<User> login(User user) throws Exception;
    User updateLastSeen(User user) throws Exception;
}