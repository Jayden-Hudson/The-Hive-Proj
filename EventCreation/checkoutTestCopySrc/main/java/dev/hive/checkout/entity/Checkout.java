package dev.hive.checkout.entity;


import java.math.BigDecimal;

public class Checkout {
    //buyer details
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    //payment details
    private String address;
    private String city;
    private String state;
    private String zip;
    private String cardNumber;
    private String expirationMonth;
    private String expirationYear;
    private String cvv;
    private String confirmationNumber;
    private BigDecimal ticketPrice;
    private BigDecimal salesTax;
    private BigDecimal passPrice;
    private BigDecimal protectionPrice;
    private BigDecimal orderTotal;

    private String orderDate;
    //purchased ticket details
    private int section;
    private int row;
    private int tickets;
    private String ticketEvent;

    public int getTickets() {
        return tickets;
    }

    public void setTickets(int tickets) {
        this.tickets = tickets;
    }

    public int getRow() {
        return row;
    }

    public void setRow(int row) {
        this.row = row;
    }

    public int getSection() {
        return section;
    }

    public void setSection(int section) {
        this.section = section;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getExpirationMonth() {
        return expirationMonth;
    }

    public void setExpirationMonth(String expirationMonth) {
        this.expirationMonth = expirationMonth;
    }

    public String getExpirationYear() {
        return expirationYear;
    }

    public void setExpirationYear(String expirationYear) {
        this.expirationYear = expirationYear;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public String getConfirmationNumber() {
        return confirmationNumber;
    }

    public void setConfirmationNumber(String confirmationNumber) {
        this.confirmationNumber = confirmationNumber;
    }

    public BigDecimal getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(BigDecimal ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    public BigDecimal getSalesTax() {
        return salesTax;
    }

    public void setSalesTax(BigDecimal salesTax) {
        this.salesTax = salesTax;
    }

    public BigDecimal getPassPrice() {
        return passPrice;
    }

    public void setPassPrice(BigDecimal passPrice) {
        this.passPrice = passPrice;
    }

    public BigDecimal getProtectionPrice() {
        return protectionPrice;
    }

    public void setProtectionPrice(BigDecimal protectionPrice) {
        this.protectionPrice = protectionPrice;
    }

    public BigDecimal getOrderTotal() {
        return orderTotal;
    }

    public void setOrderTotal(BigDecimal orderTotal) {
        this.orderTotal = orderTotal;
    }

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }

    public String getTicketEvent() {
        return ticketEvent;
    }

    public void setTicketEvent(String ticketEvent) {
        this.ticketEvent = ticketEvent;
    }


}
