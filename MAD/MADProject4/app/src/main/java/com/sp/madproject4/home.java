package com.sp.madproject4;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.FragmentManager;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationBarView;
import com.google.android.material.navigation.NavigationView;

public class home extends AppCompatActivity {
    private FragmentManager fragManager = getSupportFragmentManager();
    private home_fragment homeFrag;
    private calendar_fragment calendarFrag;
    private BottomNavigationView navBar;
    private DrawerLayout drawerLayout;
    private NavigationView navigationView;

    // Activity status tracking
    private boolean[] activityStatuses = {false, false, false, false, false}; // Example: true = Finished, false = Not Finished
    private TextView activityItem1, activityItem2, activityItem3, activityItem4, activityItem5;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        // Initialize toolbar
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("ActiveTrack");

        // Initialize DrawerLayout and NavigationView
        drawerLayout = findViewById(R.id.drawer_layout);
        navigationView = findViewById(R.id.navigation_view);

        View headerView = navigationView.getHeaderView(0);
        drawer_header drawerHeaderManager = new drawer_header(headerView, this);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawerLayout, toolbar,
                R.string.drawer_open, R.string.drawer_close);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        // Handle navigation drawer item clicks
        navigationView.setNavigationItemSelectedListener(item -> {
            int id = item.getItemId();
            if (id == R.id.nav_logout) {
                Toast.makeText(home.this, "Logout Selected", Toast.LENGTH_SHORT).show();
            }
            drawerLayout.closeDrawers();
            return true;
        });

        // Initialize Fragments
        homeFrag = new home_fragment();
        calendarFrag = new calendar_fragment();

        // Initialize BottomNavigationView
        navBar = findViewById(R.id.bottomNavigationView);
        navBar.setOnItemSelectedListener(switchPage);

        // Set default fragment
        fragManager.beginTransaction()
                .replace(R.id.flFragment, homeFrag)
                .commit();

        // Initialize activity items
        initializeActivityItems();

        // Sync activity statuses with home_fragment pie chart
        syncActivityStatusWithFragments();
    }

    private void initializeActivityItems() {
        View headerView = navigationView.getHeaderView(0);
        activityItem1 = headerView.findViewById(R.id.activity_item_1);
        activityItem2 = headerView.findViewById(R.id.activity_item_2);
        activityItem3 = headerView.findViewById(R.id.activity_item_3);
        activityItem4 = headerView.findViewById(R.id.activity_item_4);
        activityItem5 = headerView.findViewById(R.id.activity_item_5);

        activityStatuses = loadActivityStatuses();

        // Update UI based on loaded statuses
        updateActivityColors();

        addActivityClickListener(activityItem1, 0);
        addActivityClickListener(activityItem2, 1);
        addActivityClickListener(activityItem3, 2);
        addActivityClickListener(activityItem4, 3);
        addActivityClickListener(activityItem5, 4);
    }

    private void addActivityClickListener(TextView activityItem, int index) {
        activityItem.setOnClickListener(v -> {
            // Toggle activity status
            activityStatuses[index] = !activityStatuses[index];

            // Update the color
            if (activityStatuses[index]) {
                activityItem.setBackgroundColor(getResources().getColor(R.color.green)); // Green
            } else {
                activityItem.setBackgroundColor(getResources().getColor(R.color.red)); // Red
            }

            // Sync statuses with home_fragment pie chart
            syncActivityStatusWithFragments();
            saveActivityStatuses();
        });
    }

    private void updateActivityColors() {
        // Update colors for each activity item based on the statuses
        setActivityColor(activityItem1, activityStatuses[0]);
        setActivityColor(activityItem2, activityStatuses[1]);
        setActivityColor(activityItem3, activityStatuses[2]);
        setActivityColor(activityItem4, activityStatuses[3]);
        setActivityColor(activityItem5, activityStatuses[4]);
    }

    private void setActivityColor(TextView activityItem, boolean isFinished) {
        if (isFinished) {
            activityItem.setBackgroundColor(getResources().getColor(R.color.green)); // Green
        } else {
            activityItem.setBackgroundColor(getResources().getColor(R.color.red)); // Red
        }
    }

    private void saveActivityStatuses() {
        SharedPreferences sharedPreferences = getSharedPreferences("ActivityStatus", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();

        // Save the activity statuses
        for (int i = 0; i < activityStatuses.length; i++) {
            editor.putBoolean("Activity_" + i, activityStatuses[i]);
        }
        editor.putInt("TotalActivities", activityStatuses.length); // Save the total activity count
        editor.apply();

        // Save pie chart data
        savePieChartData();
    }


    private boolean[] loadActivityStatuses() {
        SharedPreferences sharedPreferences = getSharedPreferences("ActivityStatus", Context.MODE_PRIVATE);
        int totalActivities = sharedPreferences.getInt("TotalActivities", 5); // Default to 5 activities
        boolean[] statuses = new boolean[totalActivities];

        // Load activity statuses
        for (int i = 0; i < totalActivities; i++) {
            statuses[i] = sharedPreferences.getBoolean("Activity_" + i, false); // Default to false (Not Finished)
        }
        return statuses;
    }

    public void syncActivityStatusWithFragments() {
        int finishedCount = 0;
        int totalCount = activityStatuses.length;

        // Count finished activities
        for (boolean status : activityStatuses) {
            if (status) finishedCount++;
        }

        // Save data in SharedPreferences
        savePieChartData();

        // Notify home_fragment (if necessary)
        if (homeFrag != null && homeFrag.isAdded()) {
            homeFrag.updatePieChart(finishedCount, totalCount);
        }
    }

    private void savePieChartData() {
        int finishedCount = 0;
        for (boolean status : activityStatuses) {
            if (status) finishedCount++;
        }

        SharedPreferences sharedPreferences = getSharedPreferences("PieChartData", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putInt("FinishedCount", finishedCount);
        editor.putInt("TotalCount", activityStatuses.length); // Use actual length of activityStatuses
        editor.apply();
    }

    public void loadPieChartDataForFragment() {
        SharedPreferences sharedPreferences = getSharedPreferences("PieChartData", Context.MODE_PRIVATE);
        int finishedCount = sharedPreferences.getInt("FinishedCount", 0);
        int totalCount = sharedPreferences.getInt("TotalCount", 5); // Default to 5 activities

        // Notify home_fragment
        if (homeFrag != null && homeFrag.isAdded()) {
            homeFrag.updatePieChart(finishedCount, totalCount);
        }
    }

    BottomNavigationView.OnItemSelectedListener switchPage = new NavigationBarView.OnItemSelectedListener() {
        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem item) {
            int id = item.getItemId();

            if (id == R.id.home && fragManager.findFragmentById(R.id.flFragment) != homeFrag) {
                fragManager.beginTransaction()
                        .replace(R.id.flFragment, homeFrag)
                        .setReorderingAllowed(true)
                        .addToBackStack(null)
                        .commit();

                // Load pie chart data into the fragment
                loadPieChartDataForFragment();
            } else if (id == R.id.calendar && fragManager.findFragmentById(R.id.flFragment) != calendarFrag) {
                fragManager.beginTransaction()
                        .replace(R.id.flFragment, calendarFrag)
                        .setReorderingAllowed(true)
                        .addToBackStack(null)
                        .commit();
            }
            return true;
        }
    };
}
