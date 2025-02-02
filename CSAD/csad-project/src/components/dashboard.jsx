import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { ref, onValue } from "firebase/database";
import Chart from "react-apexcharts";
import "./dashboard.css";

function Dashboard() {
  const [fitnessData, setFitnessData] = useState({
    calories: 0,
    steps: 0,
    heartRate: 0,
    workoutTime: 0,
    dailyCalories: [],
    dailyWorkoutTime: [],
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  useEffect(() => {
    if (!auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const fitnessRef = ref(db, `fitnessData/userId123`);

    onValue(fitnessRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Fetched Data:", data);
      if (data) {
        setFitnessData({
          calories: data.calories || 0,
          steps: data.steps || 0,
          heartRate: data.heartRate || 0,
          workoutTime: data.workoutTime || 0,
          dailyCalories: data.dailyCalories || [0, 0, 0, 0, 0, 0, 0],
          dailyWorkoutTime: data.dailyWorkoutTime || [0, 0, 0, 0, 0, 0, 0],
          protein: data.protein || 0,
          carbs: data.carbs || 0,
          fats: data.fats || 0,
        });
      }
    });
  }, [auth.currentUser?.uid]);

  // Workout Trends Chart (Last 7 Days)
  const workoutChart = {
    options: {
      chart: { type: "area", height: 250, toolbar: { show: false } },
      colors: ["#06b6d4", "#f97316"],
      stroke: { curve: "smooth" },
      xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    },
    series: [
      { name: "Calories Burned", data: fitnessData.dailyCalories },
      { name: "Workout Time (mins)", data: fitnessData.dailyWorkoutTime },
    ],
  };

  // Radial Progress Chart (Fitness Goal Completion)
  const radialChart = {
    options: {
      chart: { type: "radialBar" },
      colors: ["#4ade80", "#facc15", "#f43f5e"], // Colors for filled portions
      plotOptions: {
        radialBar: {
          track: {
            background: "", // Change this to the desired background color
          },
          dataLabels: {
            show: true,
            name: { fontSize: '14px' },
            value: { fontSize: '16px' }
          }
        }
      },
      labels: ["Calories", "Steps", "Workout"],
    },
    series: [
      (fitnessData.calories / 2000) * 100, // % of daily goal (2000 kcal)
      (fitnessData.steps / 10000) * 100, // % of daily goal (10k steps)
      (fitnessData.workoutTime / 60) * 100, // % of daily goal (1 hour)
    ],
};


  // Pie Chart (Macronutrient Breakdown)
  const macroChart = {
    options: {
      chart: { type: "pie" },
      labels: ["Protein", "Carbs", "Fats"],
      colors: ["#34d399", "#60a5fa", "#f87171"],
    },
    series: [fitnessData.protein, fitnessData.carbs, fitnessData.fats],
  };

  return (
    <div className="h-[100%] rounded">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#cad4df]">
          Welcome, {auth.currentUser?.displayName || "User"}!
        </h2>
      </div>

      {/* Fitness Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <FitnessCard title="Calories Burned" value={`${fitnessData.calories} kcal`} />
        <FitnessCard title="Steps Taken" value={`${fitnessData.steps} steps`} />
        <FitnessCard title="Heart Rate" value={`${fitnessData.heartRate} BPM`} />
        <FitnessCard title="Workout Time" value={`${fitnessData.workoutTime} mins`} />
      </div>

      {/* Charts Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Macronutrient Breakdown Chart (Left) */}
        <div className="bg-[#FDF4DC] p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Macronutrient Breakdown (Protein, Carbs, Fats)</h3>
          <Chart options={macroChart.options} series={macroChart.series} type="pie" height={250} />
        </div>

        {/* Radial Chart (Right) */}
        <div className="bg-[#FDF4DC] p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Fitness Goal Progress</h3>
          <Chart options={radialChart.options} series={radialChart.series} type="radialBar" height={250} />
        </div>
      </div>

      {/* Workout Trends Chart (Below) */}
      <div className="mt-8 bg-[#FDF4DC] p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Workout Trends (Last 7 Days)</h3>
        <Chart options={workoutChart.options} series={workoutChart.series} type="area" height={250} />
      </div>
    </div>
  );
}

// Fitness Card Component
const FitnessCard = ({ title, value }) => (
  <div className="bg-[#FDF4DC] p-4 rounded-lg shadow flex flex-col items-center font-sans">
    <p className="text-gray-500">{title}</p>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
);

export default Dashboard;