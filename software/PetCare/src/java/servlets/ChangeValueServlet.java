/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import database.tables.EditPetKeepersTable;
import database.tables.EditPetOwnersTable;
import java.io.IOException;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.PetKeeper;
import mainClasses.PetOwner;

/**
 *
 * @author giann
 */
public class ChangeValueServlet extends HttpServlet {

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
        processRequest(request, response);
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
        processRequest(request, response);
        String field = request.getParameter("field");
        String value = request.getParameter("value");
        String userJson = request.getParameter("user");
        String userType = request.getParameter("userType");
        try {
            if (request.getParameter("userType").equals("keeper")) {

                EditPetKeepersTable editKeeper = new EditPetKeepersTable();
                PetKeeper keeper = editKeeper.jsonToPetKeeper(userJson);
                editKeeper.updatePetKeeper(keeper.getUsername(), field, value);

            } else {
                EditPetOwnersTable editOwner = new EditPetOwnersTable();
                PetOwner owner = editOwner.jsonToPetOwner(userJson);
                editOwner.updatePetOwner(owner.getUsername(), field, value);
            }
        } catch (SQLException ex) {
            Logger.getLogger(ChangeValueServlet.class.getName()).log(Level.SEVERE, null, ex);
            response.setStatus(500);

        } catch (ClassNotFoundException ex) {
            Logger.getLogger(ChangeValueServlet.class.getName()).log(Level.SEVERE, null, ex);
            response.setStatus(500);

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
