package example.controller;

import example.model.Notification;
import example.model.User;
import example.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/notification")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @RequestMapping(value="/save", method= RequestMethod.POST)
    public @ResponseBody
    List<Notification> saveMultiple(@RequestBody List<Notification> notifications) throws Exception {

        return notificationService.saveMultiple(notifications);
    }

    @RequestMapping(value="/user", method= RequestMethod.POST)
    public @ResponseBody
    List<Notification> findByUser(@RequestBody User user) throws Exception {

        return notificationService.findByUser(user);
    }
}
