package example.dao;

import example.model.EmployeeDO;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
public interface EmployeeDAO extends CrudRepository<EmployeeDO, Long> {

//	void create(EmployeeDO employeeDO) throws Exception;
//	EmployeeDO view(int id) throws Exception;
//	List<EmployeeDO> getAll() throws Exception;
//	void removeEmployee(int id) throws Exception;

    List<EmployeeDO> findByEmail(String email);
    List<EmployeeDO> findByFirstName(String firstName);
}