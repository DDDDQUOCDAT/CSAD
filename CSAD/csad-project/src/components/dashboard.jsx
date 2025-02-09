import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { ref, onValue } from "firebase/database";
import Chart from "react-apexcharts";

function Dashboard() {
  const [fitnessData, setFitnessData] = useState({
    totalCalories: 0,
    totalDistance: 0,
    totalTime: 0,
    totalActivities: 0,
    dailyCalories: [],
    workoutTime: [],
    protein: 0,
    carbs: 0,
    fats: 0,
    activityHistory: [],
    activityTypeDistribution: {},
  });

  useEffect(() => {
    if (!auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const userRef = ref(db, `Users/${userId}`);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Fetched Data:", data);
      if (data) {
        const activityHistory = data.activityHistory || {};
        const dates = Object.keys(activityHistory);

        const activities = dates.length > 0 ? activityHistory[dates[dates.length - 1]] : {};
        const dailyCalories = Object.values(activities).map(
          (act) => parseFloat((act["Calories Burnt"] || 0).toFixed(3))
        );
        const workoutTime = Object.values(activities).map((act) => act["Time"] || "00:00:00").map((time) => convertTimeToMinutes(time));

        const activityTypeCount = {};
        Object.values(activities).forEach((act) => {
          const type = act["Activity Type"] || "Other";
          activityTypeCount[type] = (activityTypeCount[type] || 0) + 1;
        });

        const foodHistory = dates.length > 0 ? data.foodList?.[dates[dates.length - 1]]?.totalNutrition || {} : {};

        setFitnessData({
          totalCalories: data.totalCalories || 0,
          totalDistance: data.totalDistance || 0,
          totalTime: data.totalTime || 0,
          totalActivities: data.totalActivities || 0,
          dailyCalories: dailyCalories,
          workoutTime: workoutTime,
          protein: foodHistory.Protein || 0,
          carbs: foodHistory.Carbs || 0,
          fats: foodHistory.Fat || 0,
          activityHistory: activities,
          activityTypeDistribution: activityTypeCount,
        });
      }
    });
  }, [auth.currentUser?.uid]);

  const convertTimeToMinutes = (timeString) => {
    const [hh, mm, ss] = timeString.split(":").map(Number);
    return hh * 60 + mm + ss / 60;
  };

const workoutChart = {
  options: {
    chart: { type: "line", height: 300, toolbar: { show: false } },
    colors: ["#06b6d4", "#f97316"],
    stroke: { curve: "smooth", width: 3, dashArray: 0, connectNulls: true },  
    fill: { type: "solid" },  
    markers: { size: 5 },
    xaxis: {
      position: "bottom",
      categories: fitnessData.dailyCalories.length > 0 
        ? Array.from({ length: fitnessData.dailyCalories.length }, (_, i) => `Day ${i + 1}`)
        : [],
      labels: { rotate: -45 },
    },
    yaxis: [
      {
        title: { text: "Calories Burned", style: { color: "#ffffff" } }, 
        labels: { style: { colors: "#06b6d4" } },
        forceNiceScale: true,
        tickAmount: 6,
        decimalsInFloat: 0,
      },
      {
        opposite: true,
        title: { text: "Workout Time (mins)", style: { color: "#ffffff" } }, 
        labels: { style: { colors: "#f97316" } },
        forceNiceScale: true,
        tickAmount: 6,
        decimalsInFloat: 0,
      },
    ],
    tooltip: { shared: true, intersect: false },
    legend: { labels: { colors: "#ffffff" } },
  },
  series: [
    {
      name: "Calories Burned",
      type: "line",
      data: fitnessData.dailyCalories.map(cal => cal),
    },
    {
      name: "Workout Time (mins)",
      type: "line",
      data: fitnessData.workoutTime.map(time => time),
    },
  ],
};
  

  const macroChart = {
    options: {
      chart: { 
        type: "pie",
        background: "transparent" 
      },
      plotOptions: {
        pie: {
          expandOnClick: true, 
        },
      },
      stroke: { show: false }, 
      labels: ["Protein", "Carbs", "Fats"],
      colors: ["#34d399", "#60a5fa", "#f87171"],
      legend: { labels: { colors: "#ffffff" } },
    },
    series: [fitnessData.protein, fitnessData.carbs, fitnessData.fats],
  };
  


  const activityTypeChart = {
    options: {
      chart: { type: "donut", background: "transparent" },
      labels: Object.keys(fitnessData.activityTypeDistribution),
      colors: ["#f97316", "#06b6d4", "#f43f5e", "#34d399"],
      stroke: { show: false },
      legend: { labels: { colors: "#ffffff" } },
    },
    series: Object.values(fitnessData.activityTypeDistribution),
  };

  return (
    <div className="p-6 bg-[#1c2633] text-white h-[100%]">
    
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#cad4df]">
          Welcome, {auth.currentUser?.displayName || "User"}!
        </h2>
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <FitnessCard title="Total Calories Burned" value={`${fitnessData.totalCalories.toFixed(2)} kcal`} />
        <FitnessCard title="Total Distance Covered" value={`${fitnessData.totalDistance.toFixed(2)} KM`} />
        <FitnessCard title="Total Workout Time" value={`${fitnessData.totalTime} mins`} />
        <FitnessCard title="Total Activities" value={`${fitnessData.totalActivities}`} />
      </div>

 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
  
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Macronutrient Breakdown</h3>
          <Chart options={macroChart.options} series={macroChart.series} type="pie" height={250} />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Activity Type Distribution</h3>
          <Chart options={activityTypeChart.options} series={activityTypeChart.series} type="donut" height={250} />
        </div>
      </div>

      <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Calories Burned & Workout Time</h3>
        <Chart options={workoutChart.options} series={workoutChart.series} type="line" height={250} />
      </div>
    </div>
  );
}

const FitnessCard = ({ title, value }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow flex flex-col items-center">
    <p className="text-gray-400">{title}</p>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
);

export default Dashboard;
