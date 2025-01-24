package com.sp.madproject4;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

public class login extends AppCompatActivity {

    private Button loginbutton;
    private EditText username, password;
    private TextView signupRedirectText;
    private SharedPreferences sharedPreferences;

    private static final String SHARED_PREF_NAME = "login_pref";
    private static final String KEY_IS_LOGGED_IN = "is_logged_in";
    private static final String KEY_USERNAME = "username";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        // Initialize views
        loginbutton = findViewById(R.id.Login);
        username = findViewById(R.id.Username);
        password = findViewById(R.id.Password);
        signupRedirectText = findViewById(R.id.signupLink);

        // Initialize SharedPreferences
        sharedPreferences = getSharedPreferences(SHARED_PREF_NAME, Context.MODE_PRIVATE);

        // Check if the user is already logged in
        if (sharedPreferences.getBoolean(KEY_IS_LOGGED_IN, false)) {
            String savedUsername = sharedPreferences.getString(KEY_USERNAME, "Guest");
            navigateToMain(savedUsername);
        }

        // Handle login button click
        loginbutton.setOnClickListener(view -> {
            if (validateInputs()) {
                authenticateUser();
            }
        });

        // Handle signup link click
        signupRedirectText.setOnClickListener(view -> {
            Intent intent = new Intent(login.this, signup.class);
            startActivity(intent);
        });
    }

    private boolean validateInputs() {
        String user = username.getText().toString().trim();
        String pass = password.getText().toString().trim();

        if (user.isEmpty()) {
            username.setError("Username cannot be empty");
            return false;
        }
        if (pass.isEmpty()) {
            password.setError("Password cannot be empty");
            return false;
        }
        return true;
    }

    private void authenticateUser() {
        String userKey = username.getText().toString().trim().replace(".", ","); // Replace dots for Firebase keys
        String userPass = password.getText().toString().trim();

        DatabaseReference reference = FirebaseDatabase.getInstance().getReference("users");
        reference.child(userKey).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                if (snapshot.exists()) {
                    String passwordFromDB = snapshot.child("password").getValue(String.class);
                    String usernameFromDB = snapshot.child("username").getValue(String.class); // Fetch username

                    if (passwordFromDB != null && passwordFromDB.equals(userPass)) {
                        saveLoginState(usernameFromDB); // Save username to SharedPreferences
                        navigateToMain(usernameFromDB);
                    } else {
                        password.setError("Invalid Credentials");
                        password.requestFocus();
                    }
                } else {
                    username.setError("User does not exist");
                    username.requestFocus();
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.e("Firebase", "Error: " + error.getMessage());
                Toast.makeText(login.this, "Database error. Please try again.", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void saveLoginState(String username) {
        // Save login state and username in SharedPreferences
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putBoolean(KEY_IS_LOGGED_IN, true);
        editor.putString(KEY_USERNAME, username); // Save the username
        editor.apply();
    }

    private void navigateToMain(String username) {
        // Navigate to the main activity or splash screen
        Intent intent = new Intent(login.this, splashscreen.class);
        intent.putExtra("username", username); // Pass username to the next activity if needed
        startActivity(intent);
        finish(); // Close login activity
    }
}
