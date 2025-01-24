package com.sp.madproject4;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

public class signup extends AppCompatActivity {

    TextView loginRedirectText;
    FirebaseDatabase database;
    DatabaseReference reference;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);

        EditText Email = findViewById(R.id.Email); // Added Email EditText
        EditText Username = findViewById(R.id.Username);
        EditText Password = findViewById(R.id.Password);
        Button SignUp = findViewById(R.id.Login);
        TextView loginRedirectText = findViewById(R.id.loginLink);

        SignUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                database = FirebaseDatabase.getInstance();
                reference = database.getReference("users");

                String email = Email.getText().toString(); // Retrieve email input
                String username = Username.getText().toString();
                String password = Password.getText().toString();

                if (email.isEmpty() || username.isEmpty() || password.isEmpty()) {
                    Toast.makeText(signup.this, "Please fill all the fields", Toast.LENGTH_SHORT).show();
                    return;
                }

                // Create HelperClass object with email, username, and password
                HelperClass helperClass = new HelperClass(email, username, password);
                reference.child(username).setValue(helperClass);

                SharedPreferences sharedPreferences = getSharedPreferences("UserPreferences", Context.MODE_PRIVATE);
                SharedPreferences.Editor editor = sharedPreferences.edit();
                editor.putString("Username", username);
                editor.apply();

                Toast.makeText(signup.this, "You have signed up successfully!", Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(signup.this, com.sp.madproject4.login.class);
                startActivity(intent);
            }
        });

        loginRedirectText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(signup.this, com.sp.madproject4.login.class);
                startActivity(intent);
            }
        });
    }
}
