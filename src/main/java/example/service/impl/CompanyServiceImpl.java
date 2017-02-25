package example.service.impl;

import example.dao.CompanyDAO;
import example.model.Company;
import example.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CompanyServiceImpl implements CompanyService {

    private final CompanyDAO companyDAO;

    @Autowired
    public CompanyServiceImpl(CompanyDAO companyDAO) {
        this.companyDAO = companyDAO;
    }

    @Override
    public void addAll(List<Company> companies) throws Exception {
        this.companyDAO.save(companies);
    }

    @Override
    public List<Company> getAll() throws Exception {
        return (List<Company>) this.companyDAO.findAll();
    }

    @Override
    public Company add(Company company) throws Exception {
        company.setClient(true);
        return this.companyDAO.save(company);
    }
}
