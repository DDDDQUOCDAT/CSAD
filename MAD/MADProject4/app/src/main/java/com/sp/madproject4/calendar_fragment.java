package com.sp.madproject4;

import android.content.DialogInterface;
import android.os.Bundle;
import android.text.InputType;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.CalendarView;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;

import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class calendar_fragment extends Fragment {

    private CalendarView calendarView;
    private TextView selectedDate;
    private FloatingActionButton addButton;
    private ListView goalsListView;
    private ArrayAdapter<String> goalsAdapter;
    private List<String> currentGoals;
    private Map<String, String[]> goalsMap;
    private String currentSelectedDate;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.activity_calendar_fragment, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Initialize views
        calendarView = view.findViewById(R.id.calendarView);
        selectedDate = view.findViewById(R.id.selectedDate);
        addButton = view.findViewById(R.id.addButton);
        goalsListView = view.findViewById(R.id.goalsListView);

        currentGoals = new ArrayList<>();
        goalsAdapter = new ArrayAdapter<>(requireContext(), android.R.layout.simple_list_item_1, currentGoals);
        goalsListView.setAdapter(goalsAdapter);
        goalsMap = new HashMap<>();
        currentSelectedDate = "";

        // Prepopulate goals
        goalsMap.put("26/01/2022", new String[]{"75 KG", "20 Push-Ups in a row"});
        goalsMap.put("27/01/2022", new String[]{"76 KG", "25 Sit-Ups in a row"});

        calendarView.setOnDateChangeListener((view1, year, month, dayOfMonth) -> {
            currentSelectedDate = String.format("%02d/%02d/%04d", dayOfMonth, month + 1, year);
            selectedDate.setText(currentSelectedDate + " - Goals");
            loadGoalsForDate(currentSelectedDate);
        });

        addButton.setOnClickListener(v -> {
            if (!currentSelectedDate.isEmpty()) {
                showAddGoalDialog();
            } else {
                Toast.makeText(requireContext(), "Please select a date first", Toast.LENGTH_SHORT).show();
            }
        });

        goalsListView.setOnItemLongClickListener((parent, view12, position, id) -> {
            String goalToRemove = currentGoals.get(position);
            new AlertDialog.Builder(requireContext())
                    .setTitle("Remove Goal")
                    .setMessage("Are you sure you want to remove this goal?")
                    .setPositiveButton("Yes", (dialog, which) -> {
                        currentGoals.remove(position);
                        goalsAdapter.notifyDataSetChanged();
                        updateGoalsMap(currentSelectedDate);
                        Toast.makeText(requireContext(), "Goal removed: " + goalToRemove, Toast.LENGTH_SHORT).show();
                    })
                    .setNegativeButton("No", null)
                    .show();
            return true;
        });
    }

    private void loadGoalsForDate(String date) {
        currentGoals.clear();
        if (goalsMap.containsKey(date)) {
            String[] goals = goalsMap.get(date);
            for (String goal : goals) {
                if (!goal.isEmpty()) currentGoals.add(goal);
            }
        } else {
            currentGoals.add("No goals set");
        }
        goalsAdapter.notifyDataSetChanged();
    }

    private void updateGoalsMap(String date) {
        if (currentGoals.isEmpty()) {
            goalsMap.remove(date);
        } else {
            goalsMap.put(date, currentGoals.toArray(new String[0]));
        }
    }

    private void showAddGoalDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(requireContext());
        builder.setTitle("Add Goals for " + currentSelectedDate);

        final EditText input = new EditText(requireContext());
        input.setHint("Goal");
        input.setInputType(InputType.TYPE_CLASS_TEXT);

        LinearLayout layout = new LinearLayout(requireContext());
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.addView(input);
        builder.setView(layout);

        builder.setPositiveButton("Save", (dialog, which) -> {
            String newGoal = input.getText().toString().trim();
            if (!newGoal.isEmpty()) {
                currentGoals.add(newGoal);
                goalsAdapter.notifyDataSetChanged();
                updateGoalsMap(currentSelectedDate);
            } else {
                Toast.makeText(requireContext(), "Goal cannot be empty", Toast.LENGTH_SHORT).show();
            }
        });

        builder.setNegativeButton("Cancel", (dialog, which) -> dialog.cancel());
        builder.show();
    }
}
