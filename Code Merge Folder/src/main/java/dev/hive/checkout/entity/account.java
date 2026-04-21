package dev.hive.checkout.entity;



public class account {

    private static int idCounter = 10000;
    private int userid;
    private String username;
    private String password;


    public account(String username, String password) {
        this.userid = idCounter++;
        this.username = username;
        this.password = password;

    }
    public account() {
    }
    public int getUserid() {
        return userid;
    }

    public void setUserid(int userID) {
        this.userid = userID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }




}
