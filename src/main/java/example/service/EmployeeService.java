package example.service;

import example.model.EmployeeDO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface EmployeeService {

    void create(EmployeeDO employeeDO) throws Exception;
    EmployeeDO view(Long id) throws Exception;
    ResponseEntity<EmployeeDO> login(EmployeeDO user) throws Exception;
    List<EmployeeDO> getAll() throws Exception;
    void removeEmployee(Long id) throws Exception;
}