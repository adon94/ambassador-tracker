package example.dao;

import example.model.BaList;
import example.model.Company;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
public interface BaListDAO extends CrudRepository<BaList, Long> {

    List<BaList> findByListManagerId(Long list_manager_id);
    List<BaList> findByCompany(Company company);
}
