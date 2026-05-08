package dev.hive.checkout.controller;

import dev.hive.checkout.entity.employee;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final JdbcTemplate jdbcTemplate;

    public EmployeeController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // GET employees with department name
    @GetMapping
    public List<employee> getEmployees() {

        String sql = """
            SELECT e.*, d.departmentname
            FROM employee e
            LEFT JOIN department d ON e.departmentid = d.departmentid
        """;

        return jdbcTemplate.query(sql, employeeRowMapper());
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody employee emp) {
        try {
            String sql = """
            SELECT * FROM employee
            WHERE employeecode = ? AND password = ?
        """;

            List<employee> result = jdbcTemplate.query(sql, employeeRowMapper(),
                    emp.getEmployeecode(),
                    emp.getPassword()
            );

            if (result.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid employee code or password");
            }

            return ResponseEntity.ok(result.get(0));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login error");
        }
    }



    //for the dashboard
    @GetMapping("/dashboard")
    public List<Map<String, Object>> getEmployee() {

        String sql = """
        SELECT
            e.firstname,
            e.lastname,
            e.employeecode,
            d.departmentname
        FROM employee e
        JOIN department d
            ON e.departmentid = d.departmentid
        ORDER BY e.employeecode DESC
        """;

        return jdbcTemplate.queryForList(sql);
    }



    // create employee
    @PostMapping("/signup")
    public ResponseEntity<String> createEmployee(@RequestBody employee emp) {
        try {

            String sql = """
                INSERT INTO employee 
                (firstname, lastname, address, zipcode, city, state, departmentid, password, employeecode)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? )
            """;

            jdbcTemplate.update(sql,
                    emp.getFirstname(),
                    emp.getLastname(),
                    emp.getAddress(),
                    emp.getZipcode(),
                    emp.getCity(),
                    emp.getState(),
                    emp.getDepartmentid(),
                    emp.getPassword(),
                    emp.getEmployeecode()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Employee created successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Database Error: " + e.getMessage());
        }
    }

    //update employee
    @PutMapping("/{lastname}")
    public ResponseEntity<String> updateEmployee(
            @PathVariable String lastname,
            @RequestBody employee emp){

        String sql = """
        UPDATE employee
        SET firstname=?, address=?, city=?, state=?
        WHERE lastname=?
    """;

        jdbcTemplate.update(sql,
                emp.getFirstname(),
                emp.getAddress(),
                emp.getCity(),
                emp.getState(),
                lastname
        );

        return ResponseEntity.ok("Employee updated");
    }

    //delete employee
    @DeleteMapping("/{lastname}")
    public ResponseEntity<String> deleteEmployee(@PathVariable String lastname){

        String sql = "DELETE FROM employee WHERE lastname=?";

        jdbcTemplate.update(sql, lastname);

        return ResponseEntity.ok("Employee deleted");
    }


    // RowMapper
    private RowMapper<employee> employeeRowMapper() {
        return (rs, rowNum) -> {
            employee emp = new employee();

            emp.setEmployeeid(rs.getInt("employeeid"));
            emp.setFirstname(rs.getString("firstname"));
            emp.setLastname(rs.getString("lastname"));

           /* if (rs.getDate("dob") != null) {
                emp.setDob(rs.getDate("dob").toLocalDate());
            }
*/
            emp.setAddress(rs.getString("address"));
            emp.setCity(rs.getString("city"));
            emp.setState(rs.getString("state"));
            emp.setZipcode(rs.getString("zipcode"));

           /* emp.setSalary(rs.getBigDecimal("salary"));
           emp.setWagerate(rs.getBigDecimal("wagerate"));

            if (rs.getDate("hiredate") != null) {
                emp.setHiredate(rs.getDate("hiredate").toLocalDate());
            }

            if (rs.getDate("releaseddate") != null) {
                emp.setReleaseddate(rs.getDate("releaseddate").toLocalDate());
            }
*/
            emp.setDepartmentid(rs.getInt("departmentid"));

            return emp;
        };
    }
}