import dev.hive.accounts.entity.account;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class searchingAccount {
   private static final String URL = "jdbc:postgresql://hive-postgres-db.chm4siqec45u.us-east-2.rds.amazonaws.com:5432/postgres?sslmode=verify-full&sslrootcert=/certs/global-bundle.pem";
   private static final String USER = "Hivepostgres";
   private static final String PASSWORD = "KnM3XC8tzh5z";


           public static void main(String[] args) {

               String filter;

               if (args.length > 0 && args[0] != null && !args[0].isBlank()) {
                   filter = args[0];
               } else {
                   try (Scanner scanner = new Scanner(System.in)) {
                       System.out.print("Enter username filter: ");
                       filter = scanner.nextLine().trim();
                   }
               }

               if (filter.isEmpty()) {
                   System.err.println("No filter provided. Exiting.");
                   return;
               }

               List<account> accounts = new ArrayList<>();

               try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD)) {

                   String sql =
                           "SELECT userID, username, password " +
                                   "FROM account " +
                                   "WHERE LOWER(username) LIKE ? " +
                                   "ORDER BY userid";

                   try (PreparedStatement stmt = conn.prepareStatement(sql)) {

                       String pattern = "%" + filter.toLowerCase() + "%";
                       stmt.setString(1, pattern);

                       try (ResultSet rs = stmt.executeQuery()) {

                           while (rs.next()) {

                               String username = rs.getString("username");
                               String password = rs.getString("password");

                               account account = new account( username, password);
                               accounts.add(account);
                           }
                       }
                   }

               } catch (SQLException e) {
                   System.err.println("Error talking to database:");
                   e.printStackTrace();
                   return;
               }

               printResultsTable(filter, accounts);
           }


           private static void printResultsTable(String filter, List<account> accounts) {

               System.out.println();
               System.out.println("SearchAccounts – filter = \"" + filter + "\"");
               System.out.println("Found " + accounts.size() + " result(s).");
               System.out.println();

               System.out.printf(
                       "%-10s %-25s %-25s%n",
                       "userID", "username", "password"
               );

               System.out.println(
                       "---------------------------------------------------------------------------------------------------------------" +
                               "----------------"
               );

               for (account a : accounts) {

                   System.out.printf(
                           "%-10d %-25s %-25s%n",
                           a.getUserID(),
                           a.getUsername(),
                           a.getPassword()
                   );
               }
           }
       }
