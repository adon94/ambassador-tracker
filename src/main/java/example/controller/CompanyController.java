package example.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import example.model.Company;
import example.model.ScrapedPage;
import example.service.CompanyService;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/company")
public class CompanyController {

    private final CompanyService companyService;

    @Autowired
    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @RequestMapping(value = "/add", method = RequestMethod.GET)
    public @ResponseBody
    List<Company> addClients() throws Exception {
        List<Company> clients = new ArrayList<>();
        for(int i = 1; i <= 50; i++) {
            Document document = Jsoup.connect("http://www.top1000.ie/companies?sortorder=turnover&sortdescending=true&page="+i)
                    .ignoreContentType(true)
                    .post();

            Element jsonText = document.getElementsByTag("body").first();

            ObjectMapper objectMapper = new ObjectMapper();

            ScrapedPage scrapedPage = objectMapper.readValue(jsonText.text(), ScrapedPage.class);

            Document doc = Jsoup.parse(scrapedPage.getHtml());

            Elements names = doc.getElementsByClass("name");

            for (Element e : names) {
                Company company = new Company();
                company.setName(e.text().substring(e.text().indexOf(" ") + 1));
                company.setClient(false);
                clients.add(company);
            }
        }

        this.companyService.addAll(clients);

        return clients;
    }

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public @ResponseBody
    List<Company> getClients() throws Exception {
        return this.companyService.getAll();
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public @ResponseBody
    Company addClient(Company company) throws Exception {
        return this.companyService.add(company);
    }
}
