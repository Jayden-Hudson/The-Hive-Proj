package dev.hive.checkout.controller;
//just for now, but this will be eventrequest
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class dashboardController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/eventrequests")
    public List<Map<String, Object>> getEventRequests() {
        String sql = """
        SELECT
            e.eventtype,
            e.performers,
            e.expectedattendance,
            e.agerange,
            e.additionaleventdetails,
            e.eventbudget,
            e.starttime,
            e.startdate
        FROM eventrequest e
        ORDER BY e.requestid DESC
    """;

        return jdbcTemplate.queryForList(sql);
    }

}