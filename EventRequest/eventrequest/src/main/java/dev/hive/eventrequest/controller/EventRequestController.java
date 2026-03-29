package dev.hive.eventrequest.controller;
import dev.hive.eventrequest.entity.EventRequest;
import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

//For Object Mapper
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

//Run program
//Open event request html page - http://localhost:8080/index.html
//Fill out form & submit
//Intellij console displays getters effectively & errors on sql statement
//<script> is in index.html & is to be split to its own file

@RestController
public class EventRequestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

@PostMapping("/api/eventrequest")
public String addEventData(@RequestBody EventRequest event) {
    // Print received data
    System.out.println("Received event request for " + event.getPerformers());
        try {
            String sql = """
                    INSERT INTO Goldenfield Database.public.eventrequest
                    (eventtype, performers, expectedattendance, agerange, additionaleventdetails, eventbudget, starttime, startdate)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """;

            int rows = jdbcTemplate.update(sql,
                    event.getEventType(),
                    event.getPerformers(),
                    event.getAttendance(),
                    event.getAges(),
                    event.getEventDetails(),
                    event.getBudget(),
                    event.getStartTime(),  // Ensure correct SQL type
                    event.getStartDate()   // Ensure correct SQL type
            );
            return rows > 0 ? "Data inserted successfully" : "Insert failed";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error inserting data: " + e.getMessage();
        }
    }
}

  /*  @PostMapping("/api/eventrequest")
    public String eventData(@RequestBody EventRequest eventData) throws JsonProcessingException {
        System.out.println("Event data received: " + eventData.getEventType() + " " +
                eventData.getPerformers() + " " +
                eventData.getStartDate() + " " +
                eventData.getStartTime() + " " +
                eventData.getAttendance() + " " +
                eventData.getAges() + " " +
                eventData.getOtherLabel() + " " +
                eventData.getBudget() + " " +
                eventData.getEventDetails());

        System.out.println("Contact data received: " + eventData.getCompany() + " " +
                eventData.getFirstName() + " " +
                eventData.getLastName() + " " +
                eventData.getPhone() + " " +
                eventData.getEmail() + " " +
                eventData.getContactTime() + " " +
                eventData.getLinks() + " " +
                eventData.getContactNotes());

        //Returns eventData = {...}
        System.out.println(new ObjectMapper().writeValueAsString(eventData));
        //What's returned in webpage "alert"
        return "Handled.";
    }

 */






