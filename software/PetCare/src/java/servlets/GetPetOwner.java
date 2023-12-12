///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
// */
//package servlets;
//
//import database.tables.EditPetOwnersTable;
//import java.io.IOException;
//import java.io.PrintWriter;
//import java.sql.SQLException;
//import java.util.logging.Level;
//import java.util.logging.Logger;
//import javax.servlet.ServletException;
//import javax.servlet.http.HttpServlet;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import mainClasses.PetOwner;
//
///**
// *
// * @author giann
// */
//public class GetPetOwner extends HttpServlet {
//
//    /**
//     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
//     * methods.
//     *
//     * @param request servlet request
//     * @param response servlet response
//     * @throws ServletException if a servlet-specific error occurs
//     * @throws IOException if an I/O error occurs
//     */
//    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
//            throws ServletException, IOException {
//
//    }
//
//    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
//    /**
//     * Handles the HTTP <code>GET</code> method.
//     *
//     * @param request servlet request
//     * @param response servlet response
//     * @throws ServletException if a servlet-specific error occurs
//     * @throws IOException if an I/O error occurs
//     */
//    @Override
//    protected void doGet(HttpServletRequest request, HttpServletResponse response)
//            throws ServletException, IOException {
//        response.setContentType("text/html;charset=UTF-8");
//
//        String username = request.getParameter("username");
//        String password = request.getParameter("password");
//        try (PrintWriter out = response.getWriter()) {
//
//            out.println(username);
//            out.println(password);
//
//            System.out.println("WTFFFFFFFFFFFFFFFFFF");
//            EditPetOwnersTable eut = new EditPetOwnersTable();
//            PetOwner su = eut.databaseToPetOwners(username, password);
//
//            if (su == null) {
//                response.setStatus(403);
//            } else {
//                String json = eut.petOwnerToJSON(su);
//                out.println(json);
//                response.setStatus(200);
//            }
//        } catch (SQLException | ClassNotFoundException ex) {
//            Logger.getLogger(GetPetKeeper.class.getName()).log(Level.SEVERE, null, ex);
//            response.setStatus(500);
//        }
//
//    }
//
//    /**
//     * Handles the HTTP <code>POST</code> method.
//     *
//     * @param request servlet request
//     * @param response servlet response
//     * @throws ServletException if a servlet-specific error occurs
//     * @throws IOException if an I/O error occurs
//     */
//    @Override
//    protected void doPost(HttpServletRequest request, HttpServletResponse response)
//            throws ServletException, IOException {
//        try {
//
//            System.out.println("Cool");
//
//            processRequest(request, response);
//
//            PetOwner owner = new PetOwner();
//            owner.setFirstname(request.getParameter("firstName"));
//            owner.setLastname(request.getParameter("lastName"));
//            owner.setUsername(request.getParameter("username"));
//            owner.setEmail(request.getParameter("email"));
//            owner.setPassword(request.getParameter("password"));
//            owner.setBirthdate(request.getParameter("birthDate"));
//            owner.setGender(request.getParameter("gender"));
//
//            owner.setCountry(request.getParameter("country"));
//            owner.setCity(request.getParameter("city"));
//            owner.setAddress(request.getParameter("address"));
//            owner.setPersonalpage(request.getParameter("personalpage"));
//            owner.setJob(request.getParameter("job"));
//            owner.setTelephone(request.getParameter("telephone"));
//
//            owner.setLat(Double.valueOf(request.getParameter("lat")));
//            owner.setLon(Double.valueOf(request.getParameter("lon")));
//
//            EditPetOwnersTable eut = new EditPetOwnersTable();
//            //eut.addPetOwnerFromJSON(eut.petOwnerToJSON(owner));
//            eut.addNewPetOwner(owner);
//            System.out.println("Owner: " + owner);
//        } catch (ClassNotFoundException ex) {
//            Logger.getLogger(GetPetOwner.class.getName()).log(Level.SEVERE, null, ex);
//        }
//    }
//
//    /**
//     * Returns a short description of the servlet.
//     *
//     * @return a String containing servlet description
//     */
//    @Override
//    public String getServletInfo() {
//        return "Short description";
//    }// </editor-fold>
//
//}
