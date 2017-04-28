package example.service.impl;

import example.dao.UserDAO;
import example.model.User;
import example.service.MailService;
import example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserDAO userDAO;

    @Autowired
    public UserServiceImpl(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    @Override
    public User create(User user) throws Exception {
        List<User> users = userDAO.findByRegistrationCode(user.getRegistrationCode());

        if (!users.isEmpty()) {
            User user1 = users.get(0);
            user.setRegistrationCode(user1.getRegistrationCode());
            user.setId(user1.getId());
            user.setManager(user1.isManager());

            return userDAO.save(user);
        } else {
            throw new Exception("Not found");
        }
    }

    @Override
    public User admin() throws Exception {

        User user = new User();
        user.setManager(true);
        user.setEmail("pembleco@gmail.com");
        user.setPassword("admin");
        user.setFirstName("Pemble");
        user.setLastName("Admin");

        return userDAO.save(user);
    }

    @Override
    public User generateCode(User user) throws Exception {
        UUID id = UUID.randomUUID();
        user.setRegistrationCode(id.toString());
        if (user.getEmail() != null) {
            MailService m = new MailService();
            m.sendRegMail(user.getEmail(), id.toString());
        }
        return userDAO.save(user);
    }

    @Override
    public User updateLastSeen(User user) throws Exception {
        Date d = new Date();
        Timestamp t = new Timestamp(d.getTime());
        user.setLastSeen(t);
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
