package dev.hive.accounts.controller;

import dev.hive.accounts.entity.department;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final JdbcTemplate jdbcTemplate;

    public DepartmentController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // GET all departments
    @GetMapping
    public List<department> getDepartments() {
        String sql = "SELECT * FROM department";
        return jdbcTemplate.query(sql, departmentRowMapper());
    }

    // POST create a new department
    @PostMapping
    public ResponseEntity<String> createDepartment(@RequestBody department dep) {
        try {
            // Check if department already exists
            String checkSql = "SELECT COUNT(*) FROM department WHERE departmentid = ?";
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, dep.getDepartmentid());

            if (count != null && count > 0) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Department ID already exists");
            }

            // Insert new department
            String insertSql = "INSERT INTO department (departmentid, departmentname) VALUES (?, ?)";
            jdbcTemplate.update(insertSql, dep.getDepartmentid(), dep.getDepartmentname());

            return ResponseEntity.status(HttpStatus.CREATED).body("Department created successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Database Error: " + e.getMessage());
        }
    }

    // RowMapper for department
    private RowMapper<department> departmentRowMapper() {
        return (rs, rowNum) -> {
            department dep = new department();
            dep.setDepartmentid(rs.getInt("departmentid"));
            dep.setDepartmentname(rs.getString("departmentname"));
            return dep;
        };
    }
}