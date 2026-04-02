package dev.hive.accounts;

import java.sql.*;

public class App {
    public static void main(String[] args) {

        String username = "Hivepostgres";
        String password = "KnM3XC8tzh5z";

        String url = "jdbc:postgresql://hive-postgres-db.chm4siqec45u.us-east-2.rds.amazonaws.com:5432/Goldenfield Database";

        try (Connection conn = DriverManager.getConnection(url, username, password);
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery("SELECT * FROM account")) {



            while (rs.next()) {
                System.out.println(rs.getInt("userid") + " - " + rs.getString("username"));
            }

        } catch (SQLException e) {
            System.err.println("Database error: " + e.getMessage());
        }
    }
}