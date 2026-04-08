package dev.hive.accounts.entity;

import javax.xml.crypto.Data;
import javax.xml.crypto.dsig.spec.XSLTTransformParameterSpec;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.time.LocalDate;

public class employee {

    private static int idCounter= 6124444;
    private int employeeid;
    private String firstname;
    private String lastname;
    private LocalDate dob;
    private String address;
    private String zipcode;
    private String city;
    private String state;
    private BigDecimal salary;
    private BigDecimal wagerate;
    private LocalDate hiredate;
    private LocalDate releaseddate;


    public employee(int employeeid, String firstname, String lastname, String address, LocalDate dob, String zipcode, String city, String state, BigDecimal salary, BigDecimal wagerate, LocalDate hiredate, LocalDate releaseddate) {
        this.employeeid = idCounter++;
        this.firstname = firstname;
        this.lastname = lastname;
        this.address = address;
        this.dob = dob;
        this.zipcode = zipcode;
        this.city = city;
        this.state = state;
        this.salary = salary;
        this.wagerate = wagerate;
        this.hiredate = hiredate;
        this.releaseddate = releaseddate;
    }

    public int getEmployeeid() {
        return employeeid;
    }

    public void setEmployeeid(int employeeid) {
        this.employeeid = employeeid;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getZipcode() {
        return zipcode;
    }

    public void setZipcode(String zipcode) {
        this.zipcode = zipcode;
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

    public BigDecimal getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }

    public BigDecimal getWagerate() {
        return wagerate;
    }

    public void setWagerate(BigDecimal wagerate) {
        this.wagerate = wagerate;
    }

    public LocalDate getHiredate() {
        return hiredate;
    }

    public void setHiredate(LocalDate hiredate) {
        this.hiredate = hiredate;
    }

    public LocalDate getReleaseddate() {
        return releaseddate;
    }

    public void setReleaseddate(LocalDate releaseddate) {
        this.releaseddate = releaseddate;
    }
}
