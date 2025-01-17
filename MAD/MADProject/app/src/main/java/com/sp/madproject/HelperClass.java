package com.sp.madproject;

public class HelperClass {

    String email,  password;


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String Password) {
        this.password = Password;
    }

    public HelperClass(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public HelperClass() {
    }
}
