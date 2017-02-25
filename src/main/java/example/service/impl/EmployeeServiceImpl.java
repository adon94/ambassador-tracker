package example.service.impl;

import example.dao.EmployeeDAO;
import example.model.AbstractUser;
import example.model.EmployeeDO;
import example.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.ws.rs.core.Response;
import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeDAO employeeDAO;

    @Autowired
    public EmployeeServiceImpl(EmployeeDAO employeeDAO) {
        this.employeeDAO = employeeDAO;
    }

    @Override
    @Transactional
    public void create(EmployeeDO employeeDO) throws Exception {
        employeeDAO.save(employeeDO);
    }

    @Override
    @Transactional
    public EmployeeDO view(Long id) throws Exception {
        return employeeDAO.findOne(id);
    }

    @Override
    @Transactional
    public ResponseEntity<EmployeeDO> login(EmployeeDO user) throws Exception {
        List<EmployeeDO> emps = employeeDAO.findByEmail(user.getEmail());
        EmployeeDO emp;
        if(!emps.isEmpty()) {
            emp = emps.get(0);
            if(emp.getPassword().equals(user.getPassword())){
                return new ResponseEntity<EmployeeDO>(emp, HttpStatus.OK);
            } else {
                return new ResponseEntity<EmployeeDO>(user, HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<EmployeeDO>(user, HttpStatus.NOT_FOUND);
        }
    }

    @Override
    @Transactional
    public List<EmployeeDO> getAll() throws Exception {
        return (List<EmployeeDO>) employeeDAO.findAll();
    }

    @Override
    @Transactional
    public void removeEmployee(Long id) throws Exception {
        this.employeeDAO.delete(id);
    }
}
