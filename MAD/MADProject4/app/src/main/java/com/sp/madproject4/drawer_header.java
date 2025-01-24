package com.sp.madproject4;

import android.content.Context;
import android.content.SharedPreferences;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;

public class drawer_header {

    private final TextView profileName;
    private final TextView activityItem1, activityItem2, activityItem3, activityItem4, activityItem5;
    private final boolean[] activityStatuses = {false, false, false, false, false}; // Example: true = Finished, false = Not Finished
    private final Context context;
    private final Button seeProfileButton; // Add button reference

    public drawer_header(View headerView, Context context) {
        this.context = context;

        // Initialize TextView for profile name
        profileName = headerView.findViewById(R.id.profile_name);

        // Initialize See Profile button
        seeProfileButton = headerView.findViewById(R.id.see_profile_button);

        // Set profile name based on signed-in user
        setProfileName();

        // Handle "See Profile" button click
        seeProfileButton.setOnClickListener(v -> navigateToProfile());

        // Initialize activity items
        activityItem1 = headerView.findViewById(R.id.activity_item_1);
        activityItem2 = headerView.findViewById(R.id.activity_item_2);
        activityItem3 = headerView.findViewById(R.id.activity_item_3);
        activityItem4 = headerView.findViewById(R.id.activity_item_4);
        activityItem5 = headerView.findViewById(R.id.activity_item_5);

        // Load saved activity statuses
        loadActivityStatuses();

        // Update the UI to reflect the saved activity statuses
        updateActivityColors();

        // Add click listeners to toggle activity status and save changes
        addActivityClickListener(activityItem1, 0);
        addActivityClickListener(activityItem2, 1);
        addActivityClickListener(activityItem3, 2);
        addActivityClickListener(activityItem4, 3);
        addActivityClickListener(activityItem5, 4);
    }

    private void navigateToProfile() {
        if (context instanceof FragmentActivity) {
            FragmentManager fragmentManager = ((FragmentActivity) context).getSupportFragmentManager();
            Fragment profileFragment = new profile_fragment(); // Replace with your ProfileFragment class

            // Replace the current fragment with ProfileFragment
            fragmentManager.beginTransaction()
                    .replace(R.id.flFragment, profileFragment) // Replace fragment_container with your container ID
                    .addToBackStack(null) // Add to back stack
                    .commit();

        }
    }

    private void setProfileName() {
        SharedPreferences sharedPreferences = context.getSharedPreferences("UserPreferences", Context.MODE_PRIVATE);
        String username = sharedPreferences.getString("Username", "Guest"); // Default to "Guest" if no username found
        profileName.setText(username); // Set the profile name dynamically
    }

    private void addActivityClickListener(TextView activityItem, int index) {
        activityItem.setOnClickListener(v -> {
            // Toggle activity status
            activityStatuses[index] = !activityStatuses[index];

            // Update the color
            if (activityStatuses[index]) {
                activityItem.setBackgroundColor(context.getResources().getColor(R.color.green)); // Green for Finished
            } else {
                activityItem.setBackgroundColor(context.getResources().getColor(R.color.red)); // Red for Not Finished
            }

            // Save activity statuses and sync with pie chart
            saveActivityStatuses();
            syncActivityStatusWithHome();
        });
    }

    private void updateActivityColors() {
        setActivityColor(activityItem1, activityStatuses[0]);
        setActivityColor(activityItem2, activityStatuses[1]);
        setActivityColor(activityItem3, activityStatuses[2]);
        setActivityColor(activityItem4, activityStatuses[3]);
        setActivityColor(activityItem5, activityStatuses[4]);
    }

    private void setActivityColor(TextView activityItem, boolean isFinished) {
        if (isFinished) {
            activityItem.setBackgroundColor(context.getResources().getColor(R.color.green)); // Green
        } else {
            activityItem.setBackgroundColor(context.getResources().getColor(R.color.red)); // Red
        }
    }

    private void saveActivityStatuses() {
        SharedPreferences sharedPreferences = context.getSharedPreferences("ActivityStatus", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        for (int i = 0; i < activityStatuses.length; i++) {
            editor.putBoolean("Activity_" + i, activityStatuses[i]);
        }
        editor.apply();
    }

    private void loadActivityStatuses() {
        SharedPreferences sharedPreferences = context.getSharedPreferences("ActivityStatus", Context.MODE_PRIVATE);
        for (int i = 0; i < activityStatuses.length; i++) {
            activityStatuses[i] = sharedPreferences.getBoolean("Activity_" + i, true); // Default to true (green)
        }
    }

    private void syncActivityStatusWithHome() {
        if (context instanceof home) {
            ((home) context).syncActivityStatusWithFragments();
        }
    }
}
