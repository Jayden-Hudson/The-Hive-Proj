package dev.hive.checkout.entity;

public class employee {

    private Integer employeeid;
    private String firstname;
    private String lastname;
    //private LocalDate dob;
    private String address;
    private String zipcode;
    private String city;
    private String state;
    //   private BigDecimal salary;
    //private BigDecimal wagerate;
    //private LocalDate hiredate;
    //private LocalDate releaseddate;
    // private Integer managerid;
    private String password;

    // ✅ NEW (simple foreign key)
    private Integer departmentid;

    private Integer employeecode;

    public employee() {}

    public Integer getEmployeeid() { return employeeid; }
    public void setEmployeeid(Integer employeeid) { this.employeeid = employeeid; }

    public String getFirstname() { return firstname; }
    public void setFirstname(String firstname) { this.firstname = firstname; }

    public String getLastname() { return lastname; }
    public void setLastname(String lastname) { this.lastname = lastname; }

    /*  public LocalDate getDob() { return dob; }
     public void setDob(LocalDate dob) { this.dob = dob; }
  */
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getZipcode() { return zipcode; }
    public void setZipcode(String zipcode) { this.zipcode = zipcode; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    /* public BigDecimal getSalary() { return salary; }
     public void setSalary(BigDecimal salary) { this.salary = salary; }

    public BigDecimal getWagerate() { return wagerate; }
     public void setWagerate(BigDecimal wagerate) { this.wagerate = wagerate; }

    public LocalDate getHiredate() { return hiredate; }
     public void setHiredate(LocalDate hiredate) { this.hiredate = hiredate; }

     public LocalDate getReleaseddate() { return releaseddate; }
     public void setReleaseddate(LocalDate releaseddate) { this.releaseddate = releaseddate; }

     public Integer getManagerid() { return managerid; }
     public void setManagerid(Integer managerid) { this.managerid = managerid; }
 */
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }


    public Integer getDepartmentid() { return departmentid; }
    public void setDepartmentid(Integer departmentid) { this.departmentid = departmentid; }

    public Integer getEmployeecode() { return employeecode; }
    public void setEmployeecode(Integer employeecode) { this.employeecode = employeecode; }
}