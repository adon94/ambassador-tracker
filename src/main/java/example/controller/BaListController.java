package example.controller;

import example.model.BaList;
import example.service.BaListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/baList")
public class BaListController {

    private BaListService baListService;

    @Autowired
    public BaListController(BaListService baListService) {
        this.baListService = baListService;
    }

    @RequestMapping(value="/create", method= RequestMethod.POST)
    public @ResponseBody
    BaList createList(@RequestBody BaList list) throws Exception {

        this.baListService.create(list);

        return list;
    }

    @RequestMapping(value="/{id}", method= RequestMethod.GET)
    public @ResponseBody
    List<BaList> getMyLists(@PathVariable Long id) throws Exception {

        return this.baListService.findByEmployeeId(id);
    }
}
