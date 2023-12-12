/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.spark_pets;

/**
 *
 * @author giann
 */
public class Pet {
    private String pet_id;
    private String owner_id;
    private String name;
    private String type;
    private String breed;
    private String gender;
    private String birthyear;
    private Double weight;
    private String description;
    private String photo;

    public Pet(String pet_id, String owner_id, String name, String type, String breed, String gender, String birthyear, Double weight, String description, String photo) {

        this.pet_id = pet_id;
        this.owner_id = owner_id;
        this.name = name;
        this.type = type;
        this.breed = breed;
        this.gender = gender;
        this.birthyear = birthyear;
        this.weight = weight;
        this.description = description;
        this.photo = photo;
    }

    public String getPet_id() {
        return pet_id;
    }

    public void setPet_id(String pet_id) {
        this.pet_id = pet_id;
    }

    public String getOwner_id() {
        return owner_id;
    }

    public void setOwner_id(String owner_id) {
        this.owner_id = owner_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBirthyear() {
        return birthyear;
    }

    public void setBirthyear(String birthyear) {
        this.birthyear = birthyear;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

}
