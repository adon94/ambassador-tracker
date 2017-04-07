package example.controller;

import example.model.Chat;
import example.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @RequestMapping(value="/create", method= RequestMethod.POST)
    public @ResponseBody
    Chat create(@RequestBody Chat chat) throws Exception {

        return chatService.create(chat);
    }

    @RequestMapping(value="/job", method= RequestMethod.POST)
    public @ResponseBody
    Chat jobChat(@RequestBody Chat chat) throws Exception {

        return chatService.jobChat(chat);
    }

    @RequestMapping(value="/user", method= RequestMethod.POST)
    public @ResponseBody
    Chat userChat(@RequestBody Chat chat) throws Exception {

        return chatService.userChat(chat);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public @ResponseBody
    List<Chat> findByParticipantsId(@PathVariable("id") Long id) throws Exception {

        return chatService.findByParticipants(id);
    }

    @RequestMapping(value = "get/{id}", method = RequestMethod.GET)
    public @ResponseBody
    Chat findOne(@PathVariable("id") Long id) throws Exception {

        return chatService.findOne(id);
    }
}
