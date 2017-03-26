package example.controller;

import example.model.User;
import example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value="/create", method= RequestMethod.POST)
    public @ResponseBody
    User create(@RequestBody User user) throws Exception {

        return userService.create(user);
    }

    @RequestMapping(value = "/view/{id}", method = RequestMethod.GET)
    public @ResponseBody
    User get(@PathVariable("id") Long id) throws Exception {
        return userService.findOne(id);
    }

    @RequestMapping(value = "/manager/{manager}", method = RequestMethod.GET)
    public @ResponseBody
    List<User> get(@PathVariable("manager") boolean manager) throws Exception {
        return userService.findByManager(manager);
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<User> login(@RequestBody User user) throws Exception {

        return userService.login(user);
    }
}