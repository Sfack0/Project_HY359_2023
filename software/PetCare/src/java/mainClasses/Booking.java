/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package mainClasses;

/**
 *
 * @author Mike
 */
public class Booking {
    String booking_id, owner_id, pet_id, keeper_id;
    String fromdate, todate, status;
    int price;
    public String getBooking_id() {
        return booking_id;
    }

    public void setBooking_id(String booking_id) {
        this.booking_id = booking_id;
    }

    public String getOwner_id() {
        return owner_id;
    }

    public void setOwner_id(String owner_id) {
        this.owner_id = owner_id;
    }

    public String getPet_id() {
        return pet_id;
    }

    public void setPet_id(String pet_id) {
        this.pet_id = pet_id;
    }

    public String getKeeper_id() {
        return keeper_id;
    }

    public void setKeeper_id(String keeper_id) {
        this.keeper_id = keeper_id;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    
    public String getFromdate() {
        return fromdate;
    }

    public void setFromdate(String fromDate) {
        this.fromdate = fromDate;
    }

    public String getTodate() {
        return todate;
    }

    public void setTodate(String toDate) {
        this.todate = toDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


  
    
}
