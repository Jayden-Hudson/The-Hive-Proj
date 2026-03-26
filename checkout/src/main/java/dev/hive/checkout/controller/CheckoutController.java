package dev.hive.checkout.controller;

import dev.hive.checkout.entity.Checkout;
/*
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody; */
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

public class CheckoutController {

    @PostMapping("/api/checkout")
    public String checkoutData(@RequestBody Checkout checkoutData) {
        //System.out.println("Data incoming..." + " " +
        /*
            checkoutData.getEmail() + " " +
            checkoutData.getFirstName() + " " +
            checkoutData.getLastName() + " " +

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
            //phone */

            return "Checkout success!";
    }

}



//Testing retrieval of data with getters
/*@PostMapping("/api/eventRequest")
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

