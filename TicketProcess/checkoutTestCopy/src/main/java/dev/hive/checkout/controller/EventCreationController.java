package dev.hive.checkout.controller;

import dev.hive.checkout.entity.EventCreation;

import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.sql.PreparedStatement;

//Run program
//Open event request html page - http://localhost:8080/ECreation.html
//Fill out form & submit
//Intellij console displays getters effectively & errors on sql statement

@RestController
public class EventCreationController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/api/ECreation")
    public String addEventData(@RequestBody EventCreation event) {

        System.out.println("Received event request for " + event.getTitle());
        try {
            KeyHolder eventKeyHolder = new GeneratedKeyHolder();

            String addEventSql = """
                        INSERT INTO public.event
                        (title, description, eventdate, eventtime, venueid)
                        VALUES (?, ?, ?, ?, ?)
                        RETURNING eventid
                    """;

            int newEventRow = jdbcTemplate.update(connection -> {
                java.sql.PreparedStatement ps = connection.prepareStatement(addEventSql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, event.getTitle());
                ps.setString(2, event.getDescription());
                ps.setObject(3, event.getEventDate());
                ps.setObject(4, event.getEventTime());
                ps.setInt(5, event.getVenueid());
                return ps;
            }, eventKeyHolder);

            if (newEventRow > 0 && eventKeyHolder.getKey() != null) {
                int eventid = eventKeyHolder.getKey().intValue();

                /*/////////////////////////////// insert into parkingbyevent //////////////////////////////*/
                String parkingSql = """
                    INSERT INTO public.parkingbyevent
                    (passesavailable, passessold, soldout, eventid)
                    VALUES (?, ?, ?, ?)
                """;

                int passesAvailable = 57;
                int passesSold = 0;
                boolean soldOut = false;

                int parkingRows = jdbcTemplate.update(connection -> {
                    PreparedStatement ps = connection.prepareStatement(parkingSql);
                    ps.setInt(1, passesAvailable);
                    ps.setInt(2, passesSold);
                    ps.setBoolean(3, soldOut);
                    ps.setInt(4, eventid);
                    return ps;
                });

                /*/////////////////////////////// insert records into eventrows //////////////////////////////*/
                String eventRowsSql = """
                            INSERT INTO public.rowsbyevent (rowid, eventid, ticketssold, soldout)
                            SELECT r.rowid, ?, r.numberoftickets, false
                            FROM rows r
                        """;

                int rowsByEvent = jdbcTemplate.update(eventRowsSql, eventid);

                System.out.println("Event rows inserted: " + newEventRow);
                System.out.println("Parking rows inserted: " + parkingRows);
                System.out.println("Rows inserted for tracking rows by event: " + rowsByEvent);

                return (parkingRows > 0 && rowsByEvent > 0)
                        ? "Data inserted successfully"
                        : "Insert failed";

            } else {
                throw new RuntimeException("Failed to retrieve generated buyer ID");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "Error inserting data: " + e.getMessage();
        }
    }


    @GetMapping("/api/events")
    public List<EventCreation> getAllEvents() {
        String selectSql = """
            SELECT * FROM public.event
            """;

        return jdbcTemplate.query(selectSql, (rs, rowNum) -> {
            EventCreation event = new EventCreation();
            event.setEventid(rs.getInt("eventid"));
            event.setTitle(rs.getString("title"));
            event.setDescription(rs.getString("description"));
            event.setEventDate(rs.getObject("eventdate", LocalDate.class));
            event.setEventTime(rs.getObject("eventtime", LocalTime.class));
            event.setVenueid(rs.getInt("venueid"));
            return event;
        });
    }
}


