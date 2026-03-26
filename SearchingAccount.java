package dev.hive.accounts;

import dev.hive.accounts.entity.account;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class SearchingAccount {

    private static final String URL = "String url =\n" +
            "jdbc:postgresql:hive-postgres-db.chm4siqec45u.us-east-2.rds.amazonaws.com:5432/Goldenfield Database";

    private static final String USER = "Hivepostgres";
    private static final String PASSWORD = "KnM3XC8tzh5z";

    public static void main(String[] args) {

        String filter;

        if (args.length > 0 && args[0] != null && !args[0].isBlank()) {
            filter = args[0];
        } else {
            Scanner scanner = new Scanner(System.in);
            System.out.print("Enter username filter: ");
            filter = scanner.nextLine().trim();
        }

        List<account> accounts = new ArrayList<>();

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD)) {

            String sql =
                    "SELECT username, password FROM account " +
                            "WHERE LOWER(username) LIKE ? ORDER BY userid";

            PreparedStatement stmt = conn.prepareStatement(sql);

            String pattern = "%" + filter.toLowerCase() + "%";
            stmt.setString(1, pattern);

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {

                String username = rs.getString("username");
                String password = rs.getString("password");

                account account = new account(username, password);
                accounts.add(account);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        System.out.println(accounts);
    }
}