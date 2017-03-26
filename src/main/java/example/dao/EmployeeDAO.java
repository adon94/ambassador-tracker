package example.dao;

import example.model.EmployeeDO;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
public interface EmployeeDAO extends CrudRepository<EmployeeDO, Long> {
    List<EmployeeDO> findByEmail(String email);
    List<EmployeeDO> findByFirstName(String firstName);
}