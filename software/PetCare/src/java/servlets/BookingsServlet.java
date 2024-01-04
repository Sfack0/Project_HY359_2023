/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import database.tables.EditBookingsTable;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.Booking;

/**
 *
 * @author giann
 */
public class BookingsServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");

    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);

            EditBookingsTable editBookings = new EditBookingsTable();

            ArrayList<Booking> bookings = editBookings.databaseToAllBookings();

            for (Booking booking : bookings) {
                response.getWriter().write(editBookings.bookingToJSON(booking) + "||");
            }
        } catch (SQLException ex) {
            Logger.getLogger(BookingsServlet.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(BookingsServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        try {
            processRequest(request, response);

            Booking booking = new Booking();
            booking.setOwner_id(request.getParameter("owner_id"));
            booking.setPet_id(request.getParameter("pet_id"));
            booking.setKeeper_id(request.getParameter("keeper_id"));
            booking.setFromdate(request.getParameter("fromdate"));
            booking.setTodate(request.getParameter("todate"));
            booking.setStatus(request.getParameter("status"));
            booking.setPrice(Integer.parseInt(request.getParameter("price")));

            EditBookingsTable editBookings = new EditBookingsTable();
            editBookings.createNewBooking(booking);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(BookingsServlet.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        try {

            BufferedReader reader = request.getReader();
            StringBuilder requestBody = new StringBuilder();

            String line;
            while ((line = reader.readLine()) != null) {
                requestBody.append(line);
            }

            String[] params = requestBody.toString().split("&");
            int bookingId = 0;
            String status = "";

            for (String param : params) {
                String[] keyValue = param.split("=");
                if (keyValue.length == 2) {
                    String key = keyValue[0];
                    String value = keyValue[1];

                    if ("booking_id".equals(key)) {
                        bookingId = Integer.parseInt(value);
                    } else if ("status".equals(key)) {
                        status = value;
                    }
                }
            }

            EditBookingsTable editBookings = new EditBookingsTable();
            editBookings.updateBooking(bookingId, status);
        } catch (SQLException ex) {
            Logger.getLogger(BookingsServlet.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(BookingsServlet.class.getName()).log(Level.SEVERE, null, ex);
        }


    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
