/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */
package com.mycompany.spark_pets;

import com.google.gson.Gson;
import database.tables.EditPetOwnersTable;
import database.tables.EditPetsTable;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.regex.Pattern;
import static spark.Spark.delete;
import static spark.Spark.post;
import static spark.Spark.get;
import mainClasses.Pet;
import static spark.Spark.put;

/**
 *
 * @author giann
 */
public class PetsRESTAPI {

    static HashMap<String, Pet> pets = new HashMap<>();
    static String apiPath = "petcare";
    static ArrayList<String> petOwnersWithPet = new ArrayList<String>();

    public static void main(String[] args) throws SQLException, ClassNotFoundException {
        EditPetsTable editPet = new EditPetsTable();
        ArrayList<Pet> petList = editPet.databaseToPets();

        for (Pet pet : petList) {
            pets.put(pet.getPet_id(), pet);
            petOwnersWithPet.add(pet.getOwner_id());
        }


        get(apiPath + "/pets/:type/:breed", (request, response) -> {
            response.type("application/json");
            ArrayList<Pet> petsWithTypeAndBreed = new ArrayList<Pet>();
            String type = request.params(":type").toLowerCase();
            String breed = request.params(":breed").toLowerCase();
            Double fromWeight = 0.0;
            Double toWeight = 0.0;

            if (request.queryParams("fromWeight") != null) {
                fromWeight = Double.parseDouble(request.queryParams("fromWeight"));
            }

            if (request.queryParams("toWeight") != null) {
                toWeight = Double.parseDouble(request.queryParams("toWeight"));
            }

            if (toWeight < fromWeight) {
                response.status(406);
                return new Gson().toJson(new StandardResponse(new Gson()
                        .toJson("Error: Maximum weight can not be lower than minimum weight")));
            }

            for (Pet pet : pets.values()) {
                if (pet.getType().toLowerCase().equals(type) && pet.getBreed().toLowerCase().equals(breed)
                        && (fromWeight == 0.0 || fromWeight <= pet.getWeight()) && (toWeight == 0.0 || toWeight >= pet.getWeight())) {
                    petsWithTypeAndBreed.add(pet);
                }
            }

            if (!petsWithTypeAndBreed.isEmpty()) {
                String json = new Gson().toJson(petsWithTypeAndBreed);
                response.status(200);
                return new Gson().toJson(new StandardResponse(new Gson().toJsonTree(petsWithTypeAndBreed)));
            } else {
                response.status(404);
                return new Gson().toJson(new StandardResponse(new Gson()
                        .toJson("Error: Pet Not Found")));
            }

        });

        post(apiPath + "/pet", (request, response) -> {
            response.type("application/json");
            Pet newPet = new Gson().fromJson(request.body(), Pet.class);

            if (!Pattern.matches("\\d{10}", newPet.getPet_id())) {
                response.status(403);
                return new Gson().toJson(new StandardResponse(new Gson()
                        .toJson("Error: Pet Id Must Be 10-digit long")));
            }

            if (Integer.parseInt(newPet.getBirthyear()) <= 2000) {
                response.status(406);
                return new Gson().toJson(new StandardResponse(new Gson()
                        .toJson("Error: Birth Year must be after 2000")));
            }


            if (newPet.getWeight() <= 0) {
                response.status(406);
                return new Gson().toJson(new StandardResponse(new Gson()
                        .toJson("Error: Weight must be over 0")));
            }

            if (!newPet.getPhoto().startsWith("http")) {
                response.status(406);
                return new Gson().toJson(new StandardResponse(new Gson()
                        .toJson("Error: Photo must start with http")));
            }

            EditPetOwnersTable editOwner = new EditPetOwnersTable();
            if (editOwner.checkIfUserExists("owner_id", newPet.getOwner_id()) == null) {
                response.status(404);
                return new Gson().toJson(new StandardResponse(new Gson()
                        .toJson("Error: This id does not much with any pet owner")));
            }


            if (pets.containsKey(newPet.getPet_id())) {
                response.status(404);
                return new Gson().toJson(new StandardResponse(new Gson()
                        .toJson("Error: Pet with id:  " + newPet.getPet_id() + " already exists")));

            }

            if (petOwnersWithPet.contains(newPet.getOwner_id())) {
                response.status(406);
                return new Gson().toJson(new StandardResponse(new Gson()
                        .toJson("Error: Each owner can have at most one pet")));

            }

            pets.put(newPet.getPet_id(), newPet);
            petOwnersWithPet.add(newPet.getOwner_id());

            response.status(200);
            editPet.createNewPet(newPet);
            return new Gson().toJson(new StandardResponse(new Gson()
                    .toJson("Success: Pet Added")));

        });

        put(apiPath + "/petWeight/:pet_id/:weight", (request, response) -> {
            response.type("application/json");
            if (pets.containsKey(request.params(":pet_id")) == false) {
                response.status(404);
                return new Gson().toJson(new StandardResponse(new Gson().toJson("Pet not found")));
            } else if (Integer.parseInt(request.params(":weight")) <= 0) {
                response.status(406);
                return new Gson().toJson(new StandardResponse(new Gson().toJson("Weight must be over 0")));
            } else {
                Pet pet = pets.get(request.params(":pet_id"));
                pet.setWeight(Double.valueOf(request.params(":weight")));

                editPet.updatePet("weight", String.valueOf(pet.getWeight()), pet.getPet_id());
                return new Gson().toJson(new StandardResponse(new Gson().toJson("Success: Weight Updated")));
            }
        });

        delete(apiPath + "/petDeletion/:pet_id", (request, response) -> {
            response.type("application/json");
            String petID = request.params(":pet_id");


            if (pets.containsKey(petID)) {
                Pet pet = pets.get(petID);
                editPet.deletePet(petID);
                petOwnersWithPet.remove(pet.getOwner_id());
                pets.remove(petID);
                return new Gson().toJson(new StandardResponse(new Gson().toJson("Pet Deleted")));
            } else {
                response.status(404);
                return new Gson().toJson(new StandardResponse(new Gson().toJson("Error: Pet not found")));
            }
        });
    }
}
