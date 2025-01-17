package com.sp.madproject;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import org.w3c.dom.Text;

public class signup extends AppCompatActivity {


    TextView loginRedirectText;
    FirebaseDatabase database;
    DatabaseReference reference;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);

        EditText Email = findViewById(R.id.Email);
        EditText Password = findViewById(R.id.Password);
        Button SignUp = findViewById(R.id.Login);
        TextView loginRedirectText = findViewById(R.id.loginLink);

        SignUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                database = FirebaseDatabase.getInstance();
                reference = database.getReference("users");

                String email = Email.getText().toString();
                String password = Password.getText().toString();

                HelperClass helperClass = new HelperClass(email, password);
                reference.child(email).setValue(helperClass);

                Toast.makeText(signup.this, "You have signup successfully!", Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(signup.this, login.class);
                startActivity(intent);
            }
        });

        loginRedirectText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(signup.this, login.class);
                startActivity(intent);
            }
        });
    }
}