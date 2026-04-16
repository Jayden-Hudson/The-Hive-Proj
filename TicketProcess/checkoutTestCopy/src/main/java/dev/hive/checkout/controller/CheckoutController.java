package dev.hive.checkout.controller;

import dev.hive.checkout.entity.Checkout;
import org.springframework.web.bind.annotation.*;

import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Optional;

@RestController
public class CheckoutController {

    // Print received data
    //#1 Insert buyer information
    //#2 Insert card information
    //#3 Insert order information

    @Autowired
    private JdbcTemplate jdbcTemplate;

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
            String orderSql = """
                    INSERT INTO public.orders
                    (confirmationnum, ticketprice, salestax, passprice, protectionprice, ordertotal, orderdate, buyerid)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """;

            int orderRows = jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(orderSql);
                ps.setString(1, checkout.getConfirmationNumber());
                ps.setBigDecimal(2, checkout.getTicketPrice());
                ps.setBigDecimal(3, checkout.getSalesTax());
                ps.setBigDecimal(4, checkout.getPassPrice());
                ps.setBigDecimal(5, checkout.getProtectionPrice());
                ps.setBigDecimal(6, checkout.getOrderTotal());
                ps.setString(7, checkout.getOrderDate());
                ps.setInt(8, buyerid.intValue());
                return ps;
            });

            /* //////////////////////
            Get the event (eventid) user bought tickets for(DONE)
            Use this to complete the NEXT steps (NOT DONE)
            ////////////////////// */
            // NEXT: update rowsByEvent table (subtract number of tickets purchased from the corresponding row for that event(& track sold out status)
            // NEXT: if user bought a parking pass, add row to parkingPass table for that order
            // NEXT: update parkingByEvent table (subtract a pass from the number of passes left(& track sold out status)
            String getEventSql = """ 
                    SELECT eventid FROM public.event WHERE title = ? 
                    """;
            Optional<?> idOfEvent = jdbcTemplate.query(getEventSql, new Object[]{checkout.getTicketEvent()}, rs -> {
                if (rs.next()) {
                    return Optional.of(rs.getInt("eventid"));
                }
                return Optional.empty();
            });
            if (idOfEvent.isPresent()) {
                System.out.println( "Event ID: " + idOfEvent.get());
              //  return "Event ID: " + idOfEvent.get();
            } else {
                System.out.println( "Event ID: not found");
               // return "No event found for title: " + checkout.getTicketEvent();
            }
            
            System.out.println("Buyer rows inserted: " + buyerRows);
            System.out.println("Card info rows inserted: " + cardInfoRows);
            System.out.println("Order rows inserted: " + orderRows);

            return (cardInfoRows > 0 && buyerRows > 0 && orderRows > 0)
                    ? "Data inserted successfully"
                    : "Insert failed";

        } catch (Exception e) {
            e.printStackTrace();
            return "Error inserting data: " + e.getMessage();
        }
    }
}











