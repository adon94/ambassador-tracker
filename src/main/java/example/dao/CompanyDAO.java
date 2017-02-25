package example.dao;

import example.model.Company;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;

@Transactional
public interface CompanyDAO extends CrudRepository<Company, Long> {
}
