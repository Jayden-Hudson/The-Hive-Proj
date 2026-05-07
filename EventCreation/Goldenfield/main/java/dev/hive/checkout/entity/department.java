package dev.hive.checkout.entity;
public class department {


    private Integer departmentid;

    private String departmentname;


    public department() {}

    public department(String departmentname) {
        this.departmentname = departmentname;
    }

    public Integer getDepartmentid() {
        return departmentid;
    }

    public void setDepartmentid(Integer departmentid) {
        this.departmentid = departmentid;
    }

    public String getDepartmentname() {
        return departmentname;
    }

    public void setDepartmentname(String departmentname) {
        this.departmentname = departmentname;
    }
}