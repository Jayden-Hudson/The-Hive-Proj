package dev.hive.proj.controller;

import dev.hive.proj.entity.account;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final JdbcTemplate jdbcTemplate;

    public AccountController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<account> getAccount() {
        String sql = "SELECT userid, username, password FROM account";
        return jdbcTemplate.query(sql, accountRowMapper());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody account acc) {
        try {
            String sql = """
                SELECT userid, username, password
                FROM account
                WHERE LOWER(username) = LOWER(?) AND password = ?
            """;

            List<account> result = jdbcTemplate.query(
                    sql,
                    accountRowMapper(),
                    acc.getUsername(),
                    acc.getPassword()
            );

            if (result.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid username or password");
            }

            return ResponseEntity.ok(result.get(0));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login error");
        }
    }

    @PostMapping
    public ResponseEntity<String> createAccount(@RequestBody account acc) {
        try {
            String sql = "INSERT INTO account (username, password) VALUES (?, ?)";

            jdbcTemplate.update(sql,
                    acc.getUsername(),
                    acc.getPassword()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Account created successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Database Error: " + e.getMessage());
        }
    }

    private RowMapper<account> accountRowMapper() {
        return (rs, rowNum) -> {
            account acc = new account();
            acc.setUserid(rs.getInt("userid"));
            acc.setUsername(rs.getString("username"));
            acc.setPassword(rs.getString("password"));
            return acc;
        };
    }
}
/*
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

 */

