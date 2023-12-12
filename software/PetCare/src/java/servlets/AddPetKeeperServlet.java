/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import database.tables.EditPetKeepersTable;
import java.io.IOException;
import java.util.Arrays;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.PetKeeper;

/**
 *
 * @author giann
 */
public class AddPetKeeperServlet extends HttpServlet {

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

        try {
            processRequest(request, response);

            PetKeeper keeper = new PetKeeper();
            keeper.setFirstname(request.getParameter("firstName"));
            keeper.setLastname(request.getParameter("lastName"));
            keeper.setUsername(request.getParameter("username"));
            keeper.setEmail(request.getParameter("email"));
            keeper.setPassword(request.getParameter("password"));
            keeper.setBirthdate(request.getParameter("birthDate"));
            keeper.setGender(request.getParameter("gender"));

            keeper.setProperty(request.getParameter("property"));
            keeper.setPropertydescription(request.getParameter("propertyDescription"));


            keeper.setCountry(request.getParameter("country"));
            keeper.setCity(request.getParameter("city"));
            keeper.setAddress(request.getParameter("address"));
            keeper.setPersonalpage(request.getParameter("personalpage"));
            keeper.setJob(request.getParameter("job"));
            keeper.setTelephone(request.getParameter("telephone"));

            keeper.setLat(Double.valueOf(request.getParameter("lat")));
            keeper.setLon(Double.valueOf(request.getParameter("lon")));

            String[] keeperTypes = request.getParameterValues("keeper-type");
            if (keeperTypes != null) {
                if (Arrays.stream(keeperTypes).anyMatch("dog-keeper"::equals)) {
                    keeper.setDogkeeper("True");
                    keeper.setDogprice(Integer.parseInt(request.getParameter("dog-price")));
                } else {
                    keeper.setDogkeeper("False");
                    keeper.setDogprice(0);
                }

                if (Arrays.stream(keeperTypes).anyMatch("cat-keeper"::equals)) {
                    keeper.setCatkeeper("True");
                    keeper.setCatprice(Integer.parseInt(request.getParameter("cat-price")));
                } else {
                    keeper.setCatkeeper("False");
                    keeper.setCatprice(0);
                }
            } else {
                keeper.setDogkeeper("False");
                keeper.setCatkeeper("False");
                keeper.setDogprice(0);
                keeper.setCatprice(0);
            }
            EditPetKeepersTable eut = new EditPetKeepersTable();
            //eut.addPetOwnerFromJSON(eut.petOwnerToJSON(owner));
            eut.addNewPetKeeper(keeper);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(AddPetKeeperServlet.class.getName()).log(Level.SEVERE, null, ex);
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
