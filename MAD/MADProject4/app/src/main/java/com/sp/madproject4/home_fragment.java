package com.sp.madproject4;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;

import com.android.volley.Request;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;

import org.eazegraph.lib.charts.PieChart;
import org.eazegraph.lib.models.PieModel;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Random;

public class home_fragment extends Fragment {

    // Weather URL to get JSON
    private String weather_url1 = "";

    // API key for URL
    private final String api_key = "673b9a19f0b6a258542a3d4d622b6502";

    private TextView textView;
    private FusedLocationProviderClient fusedLocationClient;

    private final int LOCATION_PERMISSION_REQUEST_CODE = 1;

    private TextView tvTipContent;

    TextView tvFinished, tvNotFinished;
    PieChart pieChart;


    // List of tips
    private final String[] tips = {
            "Exercising improves brain performance.",
            "Cardiovascular exercise helps create new brain cells.",
            "Stay hydrated for better focus and energy.",
            "A 10-minute walk can boost your mood.",
            "Regular exercise strengthens your immune system.",
            "Stretching daily reduces stress and tension.",
            "Exercising improves brain performance. Cardiovascular exercise helps create new brain cells. This enhances brainpower and brain activity.",
            "Good sleep enhances physical and mental performance."
    };


    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        // Inflate the fragment's layout
        return inflater.inflate(R.layout.activity_home_fragment, container, false);
    }



    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Initialize UI elements
        textView = view.findViewById(R.id.textView);
        tvFinished = view.findViewById(R.id.Finished);
        tvNotFinished = view.findViewById(R.id.NotFinished);
        tvTipContent = view.findViewById(R.id.tv_tip_content);
        pieChart = view.findViewById(R.id.piechart);

        // Create an instance of the Fused Location Provider Client
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(requireActivity());

        // Check for location permission and fetch weather data automatically
        checkForPermission();
        displayRandomTip();
        setData();

    }

    private void setData() {
        // Fetch data from SharedPreferences
        SharedPreferences sharedPreferences = requireActivity().getSharedPreferences("PieChartData", Context.MODE_PRIVATE);
        int finishedCount = sharedPreferences.getInt("FinishedCount", 0);
        int totalCount = sharedPreferences.getInt("TotalCount", 5); // Default to 5

        // Calculate not finished count
        int notFinishedCount = totalCount - finishedCount;

        // Update the TextViews
        tvFinished.setText(String.valueOf(finishedCount));
        tvNotFinished.setText(String.valueOf(notFinishedCount));

        // Clear and add slices to the PieChart
        pieChart.clearChart();
        pieChart.addPieSlice(new PieModel("Finished", finishedCount, Color.parseColor("#66BB6A"))); // Green
        pieChart.addPieSlice(new PieModel("Not Finished", notFinishedCount, Color.parseColor("#D6240D"))); // Red

        // Animate the PieChart
        pieChart.startAnimation();
    }

    private void displayRandomTip() {
        // Generate a random index
        Random random = new Random();
        int randomIndex = random.nextInt(tips.length);

        // Set the random tip to the TextView
        tvTipContent.setText(tips[randomIndex]);
    }

    private void checkForPermission() {
        if (ActivityCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {

            // Request permissions
            requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},
                    LOCATION_PERMISSION_REQUEST_CODE);
        } else {
            // Permissions are already granted, obtain the location
            obtainLocation();
        }
    }

    public void updatePieChart(int finishedCount, int totalCount) {
        int notFinishedCount = totalCount - finishedCount;

        // Update the TextViews
        tvFinished.setText(String.valueOf(finishedCount));
        tvNotFinished.setText(String.valueOf(notFinishedCount));

        // Clear and update the PieChart
        pieChart.clearChart();
        pieChart.addPieSlice(new PieModel("Finished", finishedCount, Color.parseColor("#66BB6A"))); // Green
        pieChart.addPieSlice(new PieModel("Not Finished", notFinishedCount, Color.parseColor("#D6240D"))); // Red

        pieChart.startAnimation();
    }



    @SuppressLint("MissingPermission")
    private void obtainLocation() {
        // Get the last location
        fusedLocationClient.getLastLocation()
                .addOnSuccessListener(requireActivity(), location -> {
                    // Get the latitude and longitude and create the HTTP URL
                    if (location != null) {
                        weather_url1 = "https://api.openweathermap.org/data/2.5/weather?lat="
                                + location.getLatitude()
                                + "&lon="
                                + location.getLongitude()
                                + "&units=metric&appid="
                                + api_key;

                        // Fetch data from the URL
                        getTemp();
                    } else {
                        textView.setText("Unable to get location");
                    }
                })
                .addOnFailureListener(requireActivity(), exception ->
                        Toast.makeText(requireContext(), "Failed to obtain location", Toast.LENGTH_SHORT).show()
                );
    }

    private void getTemp() {
        // Instantiate the RequestQueue
        com.android.volley.RequestQueue queue = Volley.newRequestQueue(requireContext());
        String url = weather_url1;

        // Request a string response from the provided URL
        StringRequest stringReq = new StringRequest(Request.Method.GET, url,
                response -> {
                    try {
                        // Get the JSON object
                        JSONObject obj = new JSONObject(response);

                        // Getting the temperature readings from response
                        JSONObject main = obj.getJSONObject("main");
                        String temperature = main.getString("temp");

                        // Getting the city name
                        String city = obj.getString("name");

                        // Getting the weather status from the weather array
                        String weatherStatus = obj.getJSONArray("weather")
                                .getJSONObject(0)
                                .getString("main");

                        // Set the temperature and weather status using getString() function
                        textView.setText(temperature + "°C");
                        TextView weatherStatusTextView = requireView().findViewById(R.id.weather_status);
                        weatherStatusTextView.setText(weatherStatus);

                        updateWeatherIcon(weatherStatus);
                    } catch (JSONException e) {
                        e.printStackTrace();
                        textView.setText("Parsing Error!");
                    }
                },
                error -> textView.setText("Failed to fetch weather data!")
        );
        queue.add(stringReq);
    }

    private void updateWeatherIcon(String weatherStatus) {
        // Find the ImageView for the weather icon
        ImageView weatherIcon = requireView().findViewById(R.id.temperature_logo);

        // Change the icon based on the weather status
        switch (weatherStatus.toLowerCase()) {
            case "clear":
                weatherIcon.setImageResource(R.drawable.weather_clear_day);
                break;
            case "clouds":
                weatherIcon.setImageResource(R.drawable.weather_cloudy);
                break;
            case "rain":
                weatherIcon.setImageResource(R.drawable.weather_rain);
                break;
            case "thunderstorm":
                weatherIcon.setImageResource(R.drawable.weather_lightning);
                break;
            case "mist":
                weatherIcon.setImageResource(R.drawable.weather_mist);
                break;
            case "partly cloudy":
                weatherIcon.setImageResource(R.drawable.weather_partly_cloudy);
                break;
            case "very cloudy":
                weatherIcon.setImageResource(R.drawable.weather_very_cloudy);
                break;
            default:
                weatherIcon.setImageResource(R.drawable.weather_cloudy); // Default icon
                break;
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                obtainLocation(); // Permission granted
            } else {
                Toast.makeText(requireContext(), "Location access is required to display weather information.", Toast.LENGTH_LONG).show();
            }
        }
    }

}
