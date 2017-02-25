package example.service;

import example.model.Company;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CompanyService {
    void addAll(List<Company> companies) throws Exception;
    List<Company> getAll() throws Exception;
    Company add(Company company) throws Exception;
}
