package dev.hive.proj.controller;

import dev.hive.proj.entity.account;
import org.springframework.web.bind.annotation.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AccountController {

    private static final String URL = "jdbc:postgresql://hive-postgres-db.chm4siqec45u.us-east-2.rds.amazonaws.com:5432/Goldenfield Database";
    private static final String USER = "Hivepostgres";
    private static final String PASSWORD = "KnM3XC8tzh5z";


    @GetMapping
    public List<account> getAccounts() {

        List<account> accounts = new ArrayList<>();
        String sql = "SELECT userid, username FROM account";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {

                account acc = new account(
                        rs.getString("username"),
                        rs.getString("password")
                );

                acc.setUserid(rs.getInt("userid"));

                accounts.add(acc);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return accounts;
    }

    @PostMapping("/login")
    public account login(@RequestBody account loginRequest) {

        String sql = "SELECT userid, username, password FROM account WHERE LOWER(username) = ? AND password = ?";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, loginRequest.getUsername().toLowerCase());
            stmt.setString(2, loginRequest.getPassword());

            try (ResultSet rs = stmt.executeQuery()) {

                if (rs.next()) {

                    account acc = new account(
                            rs.getString("username"),
                            rs.getString("password")
                    );

                    acc.setUserid(rs.getInt("userid"));

                    return acc;
                }

               /*else {
                    return "Wrong username or password";
               }
               */


            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }

    @PostMapping
    public String createAccount(@RequestBody account newAccount) {

        String checkSql = "SELECT 1 FROM account WHERE LOWER(username) = ?";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD)) {

            // check if username exists
            try (PreparedStatement stmt = conn.prepareStatement(checkSql)) {

                stmt.setString(1, newAccount.getUsername().toLowerCase());

                try (ResultSet rs = stmt.executeQuery()) {

                    if (rs.next()) {
                        return "Username already exists";
                    }
                }
            }

            String insertSql = "INSERT INTO account (username, password) VALUES (?, ?)";

            try (PreparedStatement stmt = conn.prepareStatement(insertSql)) {

                stmt.setString(1, newAccount.getUsername());
                stmt.setString(2, newAccount.getPassword());

                stmt.executeUpdate();
            }

        } catch (SQLException e) {
            e.printStackTrace();
            return "Database error";
        }

        return "Account created!";
    }
}