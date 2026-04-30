package dev.hive.checkout.controller;

import dev.hive.checkout.entity.EventCreation;
import dev.hive.checkout.entity.EventRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

//Run program
//Open event request html page - http://localhost:8080/eventRequest.html
//Fill out form & submit
//Intellij console displays getters effectively & errors on sql statement

//PK/FK NOTES...
//RETURNING requestid (must MATCH column name) - Line 43
//Line 80 - must match fk/pk type - int NOT long

@RestController
public class EventRequestController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/api/eventrequest")
    public String addEventData(@RequestBody EventRequest event) {
        // Print received data
        System.out.println("Received event request for " + event.getPerformers());
        try {
            KeyHolder keyHolder = new GeneratedKeyHolder();

            String eventSql = """
                        INSERT INTO public.eventrequest
                        (eventtype, performers, expectedattendance, agerange, additionaleventdetails, eventbudget, starttime, startdate)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        RETURNING requestid
                    """;

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(eventSql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, event.getEventType());
                ps.setString(2, event.getPerformers());
                ps.setString(3, event.getAttendance());
                ps.setString(4, event.getAges());
                ps.setString(5, event.getEventDetails());
                ps.setString(6, event.getBudget());
                ps.setString(7, event.getStartTime());
                ps.setString(8, event.getStartDate());
                return ps;
            }, keyHolder);

            // Get generated event ID
            Number requestid = keyHolder.getKey();
            if (requestid == null) {
                throw new RuntimeException("Failed to retrieve generated event ID");
            }

            String contactSql = """
                        INSERT INTO public.contactinfo
                        (companyname, contactfirstname, contactlastname, phone, email, besttimetobereached, links, additionalcontactnotes, requestid)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """;

            int contactRows = jdbcTemplate.update(contactSql,
                    event.getCompany(),
                    event.getFirstName(),
                    event.getLastName(),
                    event.getPhone(),
                    event.getEmail(),
                    event.getContactTime(),
                    event.getLinks(),
                    event.getContactNotes(),
                    requestid.intValue());

            return contactRows > 0 ? "Data inserted successfully" : "Insert failed";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error inserting data: " + e.getMessage();
        }
    }

    // get event request data for displaying on event creation page
    @GetMapping("/api/eventrequests")
    public List<EventRequest> getAllEventRequests() {
        String selectEventSql = """
                SELECT * FROM public.eventrequest
                """;

        return jdbcTemplate.query(selectEventSql, (rs, rowNum) -> {
            EventRequest event = new EventRequest();
            event.setEventType(rs.getString("eventtype"));
            event.setPerformers(rs.getString("performers"));
            event.setAttendance(rs.getString("expectedattendance"));
            event.setAges(rs.getString("agerange"));
            event.setEventDetails(rs.getString("additionaleventdetails"));
            event.setBudget(rs.getString("eventbudget"));
            event.setStartTime(rs.getString("starttime"));
            event.setStartDate(rs.getString("startdate"));
            return event;
        });
    }

    // Get event request data by ID
    @GetMapping("/api/eventrequests/{id}")
    public EventRequest getEventById(@PathVariable int id) {
        String eventByIdSql = """
                SELECT * FROM public.eventrequest WHERE requestid = ?
                """;
        try {
            return jdbcTemplate.queryForObject(eventByIdSql, (rs, rowNum) -> {
                EventRequest event = new EventRequest();
                event.setEventType(rs.getString("eventtype"));
                event.setPerformers(rs.getString("performers"));
                event.setAttendance(rs.getString("expectedattendance"));
                event.setAges(rs.getString("agerange"));
                event.setEventDetails(rs.getString("additionaleventdetails"));
                event.setBudget(rs.getString("eventbudget"));
                event.setStartTime(rs.getString("starttime"));
                event.setStartDate(rs.getString("startdate"));
                return event;
            }, id);

        } catch (Exception e) {
            throw new RuntimeException("Event not found with id: " + id);
        }
    }

}