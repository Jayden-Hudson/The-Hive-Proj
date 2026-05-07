package dev.hive.checkout.controller;

import dev.hive.checkout.entity.Checkout;
import dev.hive.checkout.entity.EventRequest;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.web.bind.annotation.*;

import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.sql.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class CheckoutController {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    private int parkingPassRow;

    /*
    @GetMapping ("/api/ticketavailability/{safeId}/{sectionId")
    public ResponseEntity<Checkout> getEventRowAvailability(@PathVariable int safeId) {
        //select rowNum?????????????????????????????
        String rowAvailabilitySql = """
                SELECT soldout AS soldoutRow
                FROM public.rowsbyevent
                WHERE eventid = ? AND sectionid = ?
                """;
        try {
            Checkout result = jdbcTemplate.queryForObject(
                    rowAvailabilitySql,
                    new BeanPropertyRowMapper<>(Checkout.class),
                    safeId
            );
            return ResponseEntity.ok(result);
        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.notFound().build();
        }
    } */

    //update parking pass before user opens checkout
    @GetMapping("/api/eventparking/{safeId}")
    public ResponseEntity<Checkout> getEventParking(@PathVariable int safeId) {
        String eventParkingSql = """
            SELECT soldout AS soldoutEvent
            FROM public.parkingbyevent
            WHERE eventid = ?
        """;
        try {
            Checkout result = jdbcTemplate.queryForObject(
                    eventParkingSql,
                    new BeanPropertyRowMapper<>(Checkout.class),
                    safeId
            );
            return ResponseEntity.ok(result);
        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/api/sections/{sectionId}/{safeId}")
    public List<Checkout>getSectionRows(@PathVariable int sectionId, @PathVariable int safeId) {

        //Get rows in section
        String rowsInSectionSql = """
            SELECT rownumber AS rowsInSection, ticketsleft AS ticketsInRow, sectionid AS clickedSection, soldout AS soldOutRow
            FROM public.rowsbyevent
            WHERE sectionid = ? AND eventid = ?
            ORDER BY rowid DESC
        """;

        try {
            return jdbcTemplate.query(rowsInSectionSql,
                    new BeanPropertyRowMapper<>(Checkout.class), sectionId, safeId);
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }


    @GetMapping("/api/soldout/sections/{sectionId}/{eventId}")
    public boolean isSectionSoldOut(@PathVariable int sectionId, @PathVariable int eventId) {
        String sql = """
            SELECT COUNT(*) 
            FROM public.rowsbyevent 
            WHERE sectionid = ? AND eventid = ? AND soldout = TRUE
        """;

        try {
            Integer soldOutCount = jdbcTemplate.queryForObject(sql, Integer.class, sectionId, eventId);
            if (soldOutCount == null) {
                return false; // No data found
            }
            //Check if all 3 defualt rows are sold out
            if (soldOutCount == 3) {
                return true;
            }
            //Check if section is GA (1 "row")
            if (sectionId == 8 && soldOutCount >= 1) {
                return true;
            }
                return false;
        } catch (Exception e) {
            System.err.println("Error getting sold out sections: " + e.getMessage());
            return false;
        }
    }


    @PostMapping("/api/checkout")
    public String addCheckoutData(@RequestBody Checkout checkout) {
        //for testing: compared getter value to console value to db value
        System.out.println("Received data for checkout order# " + checkout.getConfirmationNumber());
        System.out.println("Tickets for " + checkout.getTicketEvent());

        try {
            /*/////////////////////////////// #1 - insert into buyer //////////////////////////////*/
            KeyHolder buyerKeyHolder = new GeneratedKeyHolder();

            String buyerSql = """
                    INSERT INTO public.buyer
                    (firstname, lastname, email, phone)
                    VALUES (?, ?, ?, ?)
                    RETURNING buyerid
                """;

            int buyerRows = jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(buyerSql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, checkout.getFirstName());
                ps.setString(2, checkout.getLastName());
                ps.setString(3, checkout.getEmail());
                ps.setString(4, checkout.getPhone());
                return ps;
            }, buyerKeyHolder);

            // get generated eventid for fk purposes
            Number buyerid = buyerKeyHolder.getKey();
            if (buyerid == null) {
                throw new RuntimeException("Failed to retrieve generated buyer ID");
            }

            /*/////////////////////////////// #2 - insert into cardinfo - fk buyerid //////////////////////////////*/
            String cardInfoSql = """
                    INSERT INTO public.cardinfo
                    (cardnum, expirationmonth, cvv, address, city, state, zip, expirationyear, buyerid)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """;

            int cardInfoRows = jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(cardInfoSql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, checkout.getCardNumber());
                ps.setString(2, checkout.getExpirationMonth());
                ps.setString(3, checkout.getCvv());
                ps.setString(4, checkout.getAddress());
                ps.setString(5, checkout.getCity());
                ps.setString(6, checkout.getState());
                ps.setString(7, checkout.getZip());
                ps.setString(8, checkout.getExpirationYear());
                ps.setInt(9, buyerid.intValue());
                return ps;
            });

            /*/////////////////////////////// #3 - insert into orders - fk buyerid //////////////////////////////*/

            KeyHolder orderKeyHolder = new GeneratedKeyHolder();

            String orderSql = """
                    INSERT INTO public.orders
                    (confirmationnum, ticketprice, salestax, passprice, protectionprice, ordertotal, orderdate, buyerid)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    RETURNING orderid
                """;

            int orderRows = jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(orderSql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, checkout.getConfirmationNumber());
                ps.setBigDecimal(2, checkout.getTicketPrice());
                ps.setBigDecimal(3, checkout.getSalesTax());
                ps.setBigDecimal(4, checkout.getPassPrice());
                ps.setBigDecimal(5, checkout.getProtectionPrice());
                ps.setBigDecimal(6, checkout.getOrderTotal());
                ps.setString(7, checkout.getOrderDate());
                ps.setInt(8, buyerid.intValue());
                return ps;
            }, orderKeyHolder);

            // get generated eventid for fk purposes
            Number orderid = orderKeyHolder.getKey();
            if (orderid == null) {
                throw new RuntimeException("Failed to retrieve generated buyer ID");
            }

            /* //////////////////////
            Get the event (eventid) user bought tickets for(DONE)
            Use this to complete the NEXT steps (NOT DONE)
            ////////////////////// */
            // TO-DO: update rowsByEvent table (subtract number of tickets purchased from the corresponding row for that event(& track sold out status)
            // DONE: if user bought a parking pass, add row to parkingPass table for that order
            // TO-DO: update parkingByEvent table (subtract a pass from the number of passes left(& track sold out status)

            String getEventSql = """
                SELECT eventid 
                FROM public.event 
                WHERE title = ?
            """;

        // Query for eventid
        Optional<Integer> idOfEvent = jdbcTemplate.query(getEventSql,
            new Object[]{checkout.getTicketEvent()},
            rs -> {
                if (rs.next()) {
                    return Optional.of(rs.getInt("eventid"));
                }
                return Optional.empty();
            }
        );

        //eventid as primitive int
        int eventid = idOfEvent.orElse(0); // default to 0 if not found

        if (eventid > 0) {
            System.out.println("Event ID: " + eventid);
        } else {
            System.out.println("Event ID: not found");
        }

        // use eventid to update parkingpass table if order included a pass
        String parkingPassSql = """
            INSERT INTO public.parkingpass
            (price, orderid, eventid)
            VALUES (?, ?, ?)
        """;

        if (checkout.getPassPrice().compareTo(BigDecimal.ZERO) > 0 && eventid > 0) {
            parkingPassRow = jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(parkingPassSql);
                ps.setBigDecimal(1, checkout.getPassPrice());
                ps.setInt(2, orderid.intValue()); // orderid is still a BigInteger?
                ps.setInt(3, eventid); // already primitive int
                return ps;
            });
        }

        //First: take tix section/row data & query for the rowid of the row in rows table
        //Second: use retrieved rowid to identify the record whose id(rowid, eventid) matches
            // the row & event of the tix
        //Next: update the identified record: decrement ticketsavailable by - ticket quantity
            // for that row during the correct event

        // Get rowid of ix purchase from rows table
            String ticketRowSectionSql = """
                    SELECT rowid 
                    FROM public.rows
                    WHERE rownumber = ? AND sectionid = ?
                    """;

            Map<String, Object> staticRow = jdbcTemplate.queryForMap(
                    ticketRowSectionSql,
                    checkout.getRow(),
                    checkout.getSection()
            );

            Integer rowIdValue = (Integer) staticRow.get("rowid");
            System.out.println("Row ID: " + rowIdValue);

            // Get the record in rowsbyevent table where row and event match purchase data
            String ticketRowEventSql = """
                    SELECT ticketsleft
                    FROM public.rowsbyevent
                    WHERE rowid = ? AND eventid = ?
                    LIMIT 1
                    """;

            Map<String, Object> dynamicTixRow = jdbcTemplate.queryForMap(
                    ticketRowEventSql,
                    rowIdValue,
                    eventid
            );

            System.out.println("Row retrieved:");
            for (Map.Entry<String, Object> entry : dynamicTixRow.entrySet()) {
                System.out.println(entry.getKey() + " = " + entry.getValue());
            }

            //NEXT: DONE -> update parkingbyevent (DONE) & rowsbyevent (DONE)
            //NEXT: code to check if passessold = passesavailabe, set soldout to true, reflect in ui
            //NEXT: code to check if tixketsleft = 0, set soldout to true, reflect in ui

            //UPDATE ROWS BY EVENT
            int ticketsLeft = ((Number) dynamicTixRow.get("ticketsleft")).intValue();
            int ticketsToBuy = checkout.getTickets();

            if (ticketsToBuy <= 0) {
                throw new IllegalArgumentException("Number of tickets to buy must be positive.");
            }
            if (ticketsLeft < ticketsToBuy) {
                throw new IllegalStateException("Not enough tickets available.");
            }

            String updateRowsTable = """
            UPDATE public.rowsbyevent
            SET ticketsleft = ticketsleft - ?,
                soldout = CASE
                             WHEN ticketsleft - ? = 0 THEN TRUE
                             ELSE soldout 
                          END
                WHERE rowid = ? AND eventid = ?
            """;

            int tixRowsUpdated = jdbcTemplate.update(
                    updateRowsTable,
                    ticketsToBuy,  // for ticketsleft decrement
                    ticketsToBuy,  // for CASE check
                    rowIdValue,
                    eventid
            );

           //update num of event tickets sold
            String sql = """
            UPDATE public.event
            SET eventticketssold = eventticketssold + ?,
                eventsoldout = (eventticketssold + ?) >= totaltickets
            WHERE eventid = ?
        """;

            int eventTixUpdated = jdbcTemplate.update(
                    sql,
                    ticketsToBuy,   // for eventticketssold increment
                    ticketsToBuy,   // for sold-out check
                    eventid          // for WHERE clause
            );
            if (eventTixUpdated > 0) {
                System.out.println("event tickets succesfully sold");
            }

        if (tixRowsUpdated == 0) {
            throw new IllegalStateException("No rows updated — check rowid and eventid.");
        }

        System.out.println("Tickets successfully decremented. Remaining: " + (ticketsLeft - ticketsToBuy));

        BigDecimal passPurchased = checkout.getPassPrice();
        if ( passPurchased!= null && passPurchased.compareTo(BigDecimal.ZERO) > 0) {
            String updateParkingTable = """
                    UPDATE public.parkingbyevent
                    SET passessold = passessold + 1,
                        soldout = (passessold + 1) >= passesavailable
                    WHERE eventid = ?
                """;

                int parkingRowsUpdated = jdbcTemplate.update(updateParkingTable, eventid);

                if (parkingRowsUpdated > 0) {
                    System.out.println("Successfully updated passessold for eventId: " + eventid);
                } else {
                    System.out.println("No rows updated. Check if eventId exists.");
                }
            } else {
                System.out.println("Pass price is zero or negative. No update performed.");
            }


            //--- for testing ------------------
            String parkingRowEventSql = """
                    SELECT passessold, passesavailable
                    FROM public.parkingbyevent
                    WHERE eventid = ?
                    """;

            Map<String, Object> dynamicParkingRow = jdbcTemplate.queryForMap(
                    parkingRowEventSql,
                    eventid
            );

            dynamicParkingRow.forEach((key, value) ->
                    System.out.println(key + " = " + value));
            //--- for testing ----------

            //for testing purposes
            System.out.println("Buyer rows inserted: " + buyerRows);
            System.out.println("Card info rows inserted: " + cardInfoRows);
            System.out.println("Order rows inserted: " + orderRows);
            System.out.println("Parking pass rows inserted: " + parkingPassRow);

            return (cardInfoRows > 0 && buyerRows > 0 && orderRows > 0)
                    ? "Data inserted successfully"
                    : "Insert failed";

        } catch (Exception e) {
            e.printStackTrace();
            return "Error inserting data: " + e.getMessage();
                }
            }
        }

/* FIXED int eventid issue - problem code below
            // Get the eventid of the event the tickets are for
            String getEventSql = """
                    SELECT eventid FROM public.event WHERE title = ?
                    """;

            Optional<Integer> idOfEvent = jdbcTemplate.query(getEventSql, new Object[]{checkout.getTicketEvent()}, rs -> {
                if (rs.next()) {
                    return Optional.of(rs.getInt("eventid"));
                }
                return Optional.empty();
            });

            int eventid = 0;

            if (idOfEvent.isPresent()) {
                eventid = idOfEvent.get();
                System.out.println("Event ID: " + eventid);
            } else {
                System.out.println("Event ID: not found");
            }

            //If order contained a parking pass, insert a record in the parkingpass table
            String parkingPassSql = """
                    INSERT INTO public.parkingpass
                    (price, orderid, eventid)
                    VALUES (?, ?, ?)
                    """;

            if (checkout.getPassPrice().compareTo(BigDecimal.ZERO) > 0) {
                parkingPassRow = jdbcTemplate.update(connection -> {
                    PreparedStatement ps = connection.prepareStatement(parkingPassSql);
                    ps.setBigDecimal(1, checkout.getPassPrice());
                    ps.setInt(2, orderid.intValue());
                    ps.setInt(3, eventid.intValue());
                    return ps;
                });
            }
 */












