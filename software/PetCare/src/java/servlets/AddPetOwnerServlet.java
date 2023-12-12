package servlets;

import database.tables.EditPetOwnersTable;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.PetOwner;

/**
 *
 * @author giann
 */
public class AddPetOwnerServlet extends HttpServlet {

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
        response.setContentType("text/html;charset=UTF-8");

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

            PetOwner owner = new PetOwner();
            owner.setFirstname(request.getParameter("firstName"));
            owner.setLastname(request.getParameter("lastName"));
            owner.setUsername(request.getParameter("username"));
            owner.setEmail(request.getParameter("email"));
            owner.setPassword(request.getParameter("password"));
            owner.setBirthdate(request.getParameter("birthDate"));
            owner.setGender(request.getParameter("gender"));

            owner.setCountry(request.getParameter("country"));
            owner.setCity(request.getParameter("city"));
            owner.setAddress(request.getParameter("address"));
            owner.setPersonalpage(request.getParameter("personalpage"));
            owner.setJob(request.getParameter("job"));
            owner.setTelephone(request.getParameter("telephone"));

            owner.setLat(Double.valueOf(request.getParameter("lat")));
            owner.setLon(Double.valueOf(request.getParameter("lon")));

            EditPetOwnersTable eut = new EditPetOwnersTable();
            //eut.addPetOwnerFromJSON(eut.petOwnerToJSON(owner));
            eut.addNewPetOwner(owner);

        } catch (ClassNotFoundException ex) {
            Logger.getLogger(AddPetOwnerServlet.class.getName()).log(Level.SEVERE, null, ex);
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
