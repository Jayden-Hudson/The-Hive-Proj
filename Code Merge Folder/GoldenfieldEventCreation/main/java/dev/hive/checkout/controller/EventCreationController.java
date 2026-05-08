package dev.hive.checkout.controller;

import dev.hive.checkout.entity.EventCreation;

import org.springframework.dao.EmptyResultDataAccessException;
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

@RestController
public class EventCreationController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/api/ECreation")
    public String addEventData(@RequestBody EventCreation event) {

        // Printed to intellij console while testing
        System.out.println("Received event request for " + event.getTitle());

        try {

            // From Hannah's update
            // Check if day already has an event
            String existsSql = "SELECT COUNT(*) FROM public.event WHERE eventdate = ?";
            Integer existing = jdbcTemplate.queryForObject(existsSql, Integer.class, event.getEventDate());
            if (existing != null && existing > 0) {
                return "There is already an event on that date. Only one event per day is allowed";
            }

            // Specify keyholder: use to get event table pk
            KeyHolder eventKeyHolder = new GeneratedKeyHolder();

            String addEventSql = """
                        INSERT INTO public.event
                        (title, description, eventdate, eventtime, venueid, totaltickets, eventticketssold, eventsoldout, eventcancelled)
                        VALUES (?, ?, ?, ?, ?,
                        (SELECT SUM(numberoftickets) FROM sections),
                        ?, ?, ?)
                        RETURNING eventid
                    """;
            boolean eventSoldOut = false;
            boolean eventCancelled = false;
            int eventTicketsSold = 0;

            int newEventRow = jdbcTemplate.update(connection -> {
                java.sql.PreparedStatement ps = connection.prepareStatement(addEventSql,
                        Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, event.getTitle());
                ps.setString(2, event.getDescription());
                ps.setObject(3, event.getEventDate());
                ps.setObject(4, event.getEventTime());
                ps.setInt(5, event.getVenueid());
                ps.setInt(6, eventTicketsSold);
                ps.setBoolean(7, eventSoldOut);
                ps.setBoolean(8, eventCancelled);
                return ps;
            }, eventKeyHolder);

            /*
             * --------------------------------------- OLD if above method doesnt work
             * //Specify sql: for event table insertion
             * String addEventSql = """
             * INSERT INTO public.event
             * (title, description, eventdate, eventtime, venueid)
             * VALUES (?, ?, ?, ?, ?)
             * RETURNING eventid
             * """;
             * 
             * int newEventRow = jdbcTemplate.update(connection -> {
             * java.sql.PreparedStatement ps = connection.prepareStatement(addEventSql,
             * Statement.RETURN_GENERATED_KEYS);
             * ps.setString(1, event.getTitle());
             * ps.setString(2, event.getDescription());
             * ps.setObject(3, event.getEventDate());
             * ps.setObject(4, event.getEventTime());
             * ps.setInt(5, event.getVenueid());
             * return ps;
             * }, eventKeyHolder);
             * -------------------------------------------------------------
             */

            /*
             * If newEventRow insertion was > 0 (meaning 1 row inserted) & a key was
             * retrieved
             * assign eventKeyholder to eventid (to use/insert into other tables as fk AND
             * insert into the following tables below
             */

            if (newEventRow > 0 && eventKeyHolder.getKey() != null) {
                int eventid = eventKeyHolder.getKey().intValue();

                // Insert a parking row for each created event (helps track passes left by
                // event)
                // parkingpass table data inserted in CHECKOUT controller
                String parkingSql = """
                            INSERT INTO public.parkingbyevent
                            (passesavailable, passessold, soldout, eventid)
                            VALUES (?, ?, ?, ?)
                        """;

                // passesAvailable for each show is constant & 57 is fictitious for now (leave
                // value for now)
                int passesAvailable = 57;
                // Passes sold when event is created will always initially be set to 0
                int passesSold = 0;
                // Event parking: soldOut will always be iniitally false the event when created
                boolean soldOut = false;

                // Data inserted into parkingbyevent including retrieved eventid as fk
                int parkingRows = jdbcTemplate.update(connection -> {
                    PreparedStatement ps = connection.prepareStatement(parkingSql);
                    ps.setInt(1, passesAvailable);
                    ps.setInt(2, passesSold);
                    ps.setBoolean(3, soldOut);
                    ps.setInt(4, eventid);
                    return ps;
                });

                // Continue data population since newEventRow & eventid were inserted/retrieved
                /*
                 * For each event, insert one record for every row the venue holds, into
                 * rowsbyevent table
                 * with composite pk rowid, eventid (from static rows table, and the event the
                 * row is being tracked for)
                 */

                String eventRowsSql = """
                                INSERT INTO public.rowsbyevent (rowid, eventid, ticketsleft, soldout, sectionid, rownumber)
                                SELECT r.rowid, ?, r.numberoftickets, false, r.sectionid, r.rownumber
                                FROM rows r
                        """;

                int rowsByEvent = jdbcTemplate.update(eventRowsSql, eventid);

                // Printed to intellij console while testing
                System.out.println("Event rows inserted: " + newEventRow);
                System.out.println("Parking rows inserted: " + parkingRows);
                System.out.println("Rows inserted for tracking rows by event: " + rowsByEvent);

                // return: alerted in webpage
                return (parkingRows > 0 && rowsByEvent > 0)
                        ? "Data inserted successfully"
                        : "Insert failed";

            } else {
                throw new RuntimeException("Failed to retrieve generated event ID");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error inserting data: " + e.getMessage();
        }
    }

    // Get eventsoldout to set innerHTML & disable Calendar button
    @GetMapping("/api/soldout/events/{eventId}")
    public Boolean isEventSoldOut(@PathVariable int eventId) {
        String sql = """
                    SELECT eventsoldout
                    FROM public.event
                    WHERE eventid = ?
                """;
        try {
            Boolean eventSoldOut = jdbcTemplate.queryForObject(sql, Boolean.class, eventId);
            return eventSoldOut != null && eventSoldOut;
        } catch (EmptyResultDataAccessException e) {
            // not sold out
            return false;
        }
    }

    @GetMapping("/api/events")
    public List<EventCreation> getAllEvents() {
        String selectEventSql = """
                SELECT * FROM public.event
                """;

        return jdbcTemplate.query(selectEventSql, (rs, rowNum) -> {
            EventCreation event = new EventCreation();
            event.setEventid(rs.getInt("eventid"));
            event.setTitle(rs.getString("title"));
            event.setDescription(rs.getString("description"));
            event.setEventDate(rs.getObject("eventdate", LocalDate.class));
            event.setEventTime(rs.getObject("eventtime", LocalTime.class));
            event.setVenueid(rs.getInt("venueid"));
            event.setEventCancelled(rs.getBoolean("eventcancelled"));
            return event;
        });
    }

    // Hannah's update: all remaining code below
    @GetMapping("/api/events/{id}")
    public EventCreation getEventById(@PathVariable int id) {
        String eventByIdSql = """
                SELECT * FROM public.event WHERE eventid = ?
                """;
        try {
            return jdbcTemplate.queryForObject(eventByIdSql, (rs, rowNum) -> {
                EventCreation event = new EventCreation();
                event.setEventid(rs.getInt("eventid"));
                event.setTitle(rs.getString("title"));
                event.setDescription(rs.getString("description"));
                event.setEventDate(rs.getObject("eventdate", java.time.LocalDate.class));
                event.setEventTime(rs.getObject("eventtime", java.time.LocalTime.class));
                event.setVenueid(rs.getInt("venueid"));
                event.setEventCancelled(rs.getBoolean("eventcancelled"));
                return event;
            }, id);

        } catch (Exception e) {
            throw new RuntimeException("Event not found with id: " + id);
        }
    }

    @PutMapping("/api/events/{id}")
    public String updateEvent(@PathVariable int id, @RequestBody EventCreation event) {

        try {
            // Check if day already has an event and exclude the current event so you can keep the same date
            String existsSql = "SELECT COUNT(*) FROM public.event WHERE eventdate = ? AND eventid <> ?  AND COALESCE(eventcancelled, false) = false";
            Integer existing = jdbcTemplate.queryForObject(existsSql, Integer.class, event.getEventDate(), id);
            if (existing != null && existing > 0 && event.getEventCancelled() != true) {
                return "There is already an event on that date. Only one event per day is allowed";
            }

            String updateEventSql = """
                    UPDATE public.event
                    SET title = ?, description = ?, eventdate = ?, eventtime = ?, venueid = ?
                    WHERE eventid = ?
                    """;

            int rowsAffected = jdbcTemplate.update(updateEventSql, event.getTitle(), event.getDescription(),
                    event.getEventDate(), event.getEventTime(), event.getVenueid(), id);

            if (rowsAffected > 0) {
                return "Event updated successfully";
            } else {
                return "Update failed for id: " + id;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error inserting data: " + e.getMessage();
        }

    }

    @PutMapping("/api/events/{id}/cancel")
    public String cancelEvent(@PathVariable int id, @RequestBody EventCreation event) {
        String updateEventSql = """
                UPDATE public.event
                SET eventcancelled = ?
                WHERE eventid = ?
                """;

        int rowsAffected = jdbcTemplate.update(updateEventSql, event.getEventCancelled(), id);

        if (rowsAffected > 0) {
            return "Event cancelled/activated successfully";
        } else {
            return "Cancellation failed for id: " + id;
        }
    }

} // End class
