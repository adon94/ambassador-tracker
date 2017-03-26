package example.service.impl;

import example.dao.UserDAO;
import example.model.User;
import example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserDAO userDAO;

    @Autowired
    public UserServiceImpl(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    @Override
    public User create(User user) throws Exception {
        return userDAO.save(user);
    }

    @Override
    public User findOne(Long id) throws Exception {
        return userDAO.findOne(id);
    }

    @Override
    public List<User> findAll() throws Exception {
        return (List<User>) userDAO.findAll();
    }

    @Override
    public List<User> findByManager(boolean manager) throws Exception {
        return (List<User>) userDAO.findByManager(manager);
    }

    @Override
    public boolean remove(Long id) throws Exception {
        userDAO.delete(id);
        return userDAO.exists(id);
    }

    @Override
    public ResponseEntity<User> login(User user) throws Exception {
        List<User> users = userDAO.findByEmail(user.getEmail());
        User u;
        if(!users.isEmpty()) {
            u = users.get(0);
            if(user.getPassword().equals(u.getPassword())){
                return new ResponseEntity<User>(u, HttpStatus.OK);
            } else {
                return new ResponseEntity<User>(user, HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<User>(user, HttpStatus.NOT_FOUND);
        }
    }
}
