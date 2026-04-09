package dev.hive.checkout.controller;

import dev.hive.checkout.entity.Checkout;
import org.springframework.web.bind.annotation.*;

import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import java.sql.PreparedStatement;
import java.sql.Statement;

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

            /*/////////////////////////////// TO BE MOVED - triggered by place order button //////////////////////////////*/
            /*/////////////////////////////// insert an event into event //////////////////////////////*/
            KeyHolder eventKeyholder = new GeneratedKeyHolder();

            String addEventSql = """
                INSERT INTO public.event (title, description, eventdate, eventtime, venueid)
                SELECT ?, ?, ?, ?, venueid
                FROM public.venue
                LIMIT 1
                RETURNING eventid;
                """;

            //values - for testing
            String title = "Loserville Tour";
            String description = "Public ticketed concert";
            java.sql.Date eventDate = java.sql.Date.valueOf("2026-05-15"); //yyyy-MM-dd
            java.sql.Time eventTime = java.sql.Time.valueOf("14:00:00");   //HH:mm:ss

            int newEventRow = jdbcTemplate.update(connection -> {
                java.sql.PreparedStatement ps = connection.prepareStatement(addEventSql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, title);
                ps.setString(2, description);
                ps.setDate(3, eventDate);
                ps.setTime(4, eventTime);
                return ps;
            }, eventKeyholder);

            if (newEventRow > 0 && eventKeyholder.getKey() != null) {

                //if inserting an event was successful...
                //create a parkingByEvent record to track parking availability by event, AND
                //one eventRows record for every record in the rows table (constants/static)
                //to track row/ticket availability by event

                int eventid = eventKeyholder.getKey().intValue();

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
                    INSERT INTO public.eventrows (rowid, eventid, ticketssold, soldout)
                    SELECT r.rowid, ?, r.numberoftickets, false
                    FROM rows r
                """;

                int rowsByEvent = jdbcTemplate.update(eventRowsSql, eventid);

                System.out.println("Event rows inserted: " + newEventRow);
                System.out.println("Parking rows inserted: " + parkingRows);
                System.out.println("Rows inserted for tracking rows by event: " + rowsByEvent);
            } //if
            /*/////////////////////////////// TO BE MOVED - END inserting eventrows and parkingbyevent for every event created //////////////////////////////*/

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

  /*
            //HERE
            String selectSql = """
                SELECT * FROM public.orders
                WHERE ticketprice = ?
                """;

            List<Map<String, Object>> ordersWithPrice = jdbcTemplate.queryForList(
                    selectSql,
                    new java.math.BigDecimal("99.90") // Use BigDecimal for exact match on numeric
            );

            ordersWithPrice.forEach(order -> {
                System.out.println("Order ID: " + order.get("id") + ", Ticket Price: " + order.get("ticketprice"));
            });

            //HERE
            */

/*
came after... Number cardid = ...
int cardInfoRows = jdbcTemplate.update(cardInfoSql,
    checkout.getCardNumber(),
    checkout.getExpirationMonth(),
    checkout.getCvv(),
    checkout.getAddress(),
    checkout.getCity(),
    checkout.getState(),
    checkout.getZip(),
    checkout.getExpirationYear(),
    buyerid.intValue()
);
return cardInfoRows > 0 ? "Data inserted successfully" : "Insert failed";
*/

/* for testing
    @PostMapping("/api/checkout")
    public String checkoutData(@RequestBody Checkout checkoutData) {
        System.out.println("Data incoming..." + " " +

        checkoutData.getEmail() + " " +
        checkoutData.getFirstName() + " " +
        checkoutData.getLastName() + " " +
        checkoutData.getPhone() + " " +

        checkoutData.getAddress() + " " +
        checkoutData.getCity() + " " +
        checkoutData.getState() + " " +
        checkoutData.getZip() + " " +
        checkoutData.getCardNumber() + " " +
        checkoutData.getExpirationMonth() + " " +
        checkoutData.getExpirationYear() + " " +
        checkoutData.getCvv() + " " +
        checkoutData.getConfirmationNumber() + " " +
        checkoutData.getTicketPrice() + " " +
        checkoutData.getSalesTax() + " " +
        checkoutData.getPassPrice() + " " +
        checkoutData.getProtectionPrice() + " " +
        checkoutData.getOrderTotal() + " " +
        checkoutData.getOrderDate());
        //phone
        return "Checkout success!";
    }
} */





