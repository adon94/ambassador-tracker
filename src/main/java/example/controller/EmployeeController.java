package example.controller;

import example.model.EmployeeDO;
import example.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Controller
@RequestMapping("/employee")
public class EmployeeController {

	private final EmployeeService employeeService;

	@Autowired
	public EmployeeController(EmployeeService employeeService) {
		this.employeeService = employeeService;
	}

	@RequestMapping(value="/create", method= RequestMethod.POST)
	public @ResponseBody
	EmployeeDO createEmployee(@RequestBody EmployeeDO employee) throws Exception {
		System.out.println("Creating EmployeeDO "+employee.getFirstName());

		this.employeeService.create(employee);

		return employee;
	}

	@RequestMapping(value = "/view/{id}", method = RequestMethod.GET)
	public @ResponseBody
	EmployeeDO getEmployee(@PathVariable("id") Long id) throws Exception {

		EmployeeDO emp = this.employeeService.view(id);
		System.out.println(emp.getFirstName());
		return emp;
	}

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public @ResponseBody
	ResponseEntity<EmployeeDO> login(@RequestBody EmployeeDO user) throws Exception {

		System.out.print(user.getEmail()+ "\n");
		System.out.print(user.getPassword()+ "\n");

		return this.employeeService.login(user);
	}

	@RequestMapping(value = "/all", method = RequestMethod.GET)
	public @ResponseBody
	List<EmployeeDO> getAll() throws Exception {

		return this.employeeService.getAll();
	}

	@RequestMapping("/remove/{id}")
	public @ResponseBody
    Map<String, String> removeEmployee(@PathVariable("id") Long id) throws Exception{
		this.employeeService.removeEmployee(id);
		Map<String, String> m = new HashMap<>();
		m.put("result", "success");
		return m;
	}
}