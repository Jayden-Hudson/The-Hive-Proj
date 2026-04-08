package dev.hive.accounts;

import java.sql.*;

public class App {
    public static void main(String[] args) {
        String password = "KnM3XC8tzh5z";
        String url = "jdbc:postgresql://hive-postgres-db.chm4siqec45u.us-east-2.rds.amazonaws.com:5432/postgres?sslmode=verify-full&sslrootcert=/certs/global-bundle.pem";

        try (Connection conn = DriverManager.getConnection(url, "Hivepostgres", password);
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery("SELECT version()")) {
            if (rs.next()) {
                System.out.println(rs.getString(1));
            }
        } catch (SQLException e) {
            System.err.println("Database error: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }
}

