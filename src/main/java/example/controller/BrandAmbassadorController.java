package example.controller;

import example.model.BrandAmbassadorDO;
import example.service.BrandAmbassadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/ba")
public class BrandAmbassadorController {

    private final BrandAmbassadorService brandAmbassadorService;

    @Autowired
    public BrandAmbassadorController(BrandAmbassadorService brandAmbassadorService) {
        this.brandAmbassadorService = brandAmbassadorService;
    }

    @RequestMapping(value="/create", method= RequestMethod.POST)
    public @ResponseBody
    BrandAmbassadorDO createBrandAmbassador(@RequestBody BrandAmbassadorDO brandAmbassador) throws Exception {
        System.out.println("Creating BrandAmbassadorDO "+brandAmbassador.getFirstName());



        this.brandAmbassadorService.create(brandAmbassador);

        return brandAmbassador;
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<BrandAmbassadorDO> login(@RequestBody BrandAmbassadorDO user) throws Exception {

        System.out.print(user.getEmail()+ "\n");
        System.out.print(user.getPassword()+ "\n");
        return this.brandAmbassadorService.login(user);
    }

    @RequestMapping(value = "/view/{id}", method = RequestMethod.GET)
    public @ResponseBody
    BrandAmbassadorDO getBrandAmbassador(@PathVariable("id") Long id) throws Exception {

        BrandAmbassadorDO ba = this.brandAmbassadorService.view(id);

        return ba;
    }

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public @ResponseBody
    List<BrandAmbassadorDO> getAll() throws Exception {

        List<BrandAmbassadorDO> ba = this.brandAmbassadorService.getAll();
        return ba;
    }

    @RequestMapping("/remove/{id}")
    public @ResponseBody
    Map<String, String> removeBrandAmbassador(@PathVariable("id") Long id) throws Exception{
        this.brandAmbassadorService.removeBrandAmbassador(id);
        Map<String, String> m = new HashMap<>();
        m.put("result", "success");
        return m;
    }
}
