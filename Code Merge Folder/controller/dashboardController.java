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

public class dashboardController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/api/dashboard")
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


    //buyers
    @GetMapping("/api/buyers")
    public List<Map<String, Object>> getBuyers() {
        String sql = """
        SELECT
        customer.buyerid,
            customer.firstname,
            customer.lastname,
            customer.email,
            customer.phone
        FROM public.buyer customer
        ORDER BY customer.buyerid DESC
    """;

        return jdbcTemplate.queryForList(sql);
    }

//order
    @GetMapping("/api/orders")
    public List<Map<String, Object>> getOrders() {

        String sql = """
            SELECT
                o.orderid,
                o.confirmationnum,
                o.ticketprice,
                o.passprice,
                o.protectionprice,
                o.ordertotal,
                o.orderdate,
                o.buyerid
            FROM public.orders o
            ORDER BY o.orderid DESC
        """;

        return jdbcTemplate.queryForList(sql);
    }



}

