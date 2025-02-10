import React, { useState, useEffect } from "react";
import './rewards.css'

const Rewards = () => {
  const [totalPoints, setTotalPoints] = useState(
    parseInt(localStorage.getItem("totalPoints")) || 0
  );
  const [loggedDays, setLoggedDays] = useState(
    parseInt(localStorage.getItem("loggedDays")) || 0
  );
  const [lastLogin, setLastLogin] = useState(
    localStorage.getItem("lastLogin") || ""
  );
  const [loginMessage, setLoginMessage] = useState("");

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  const rewardCosts = {
    "1-minute stress buster tip": 90,
    "Nutri-Tip of the Day!": 150,
    "Knock-knock jokes": 200,
  };

  const jokes = [
    "Why don’t skeletons fight each other? They don’t have the guts! 😂",
    "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾🤣",
    "What do you call fake spaghetti? An impasta! 🍝😆",
    "Why couldn't the bicycle stand up by itself? It was two-tired! 🚲😂",
    "How do trees access the internet? They log in! 🌳😆",
  ];

  const stressBusterTips = [
    "Take a deep breath and relax! 😌",
    "Stretch your arms, legs, and neck to release tension. 🧘‍♂️",
    "Take a 5-minute walk to clear your mind. 🚶‍♀️",
    "Listen to calming music to ease your stress. 🎶",
    "Close your eyes and visualize a peaceful place. 🌅",
  ];

  const nutriTips = [
    "Drink at least 8 cups of water today! 💧",
    "Add more vegetables to your meals for better health. 🥦",
    "Eat a balanced breakfast to start your day strong! 🍳",
    "Snack on fruits like apples or berries for a healthy treat. 🍏🍓",
    "Choose whole grains like brown rice or oats for better digestion. 🌾",
  ];

  useEffect(() => {
    localStorage.setItem("totalPoints", totalPoints);
    localStorage.setItem("loggedDays", loggedDays);
  }, [totalPoints, loggedDays]);

  const handleDailyLogin = () => {
    const today = new Date().toDateString();

    if (lastLogin === today) {
      setLoginMessage("You have already checked in today! ✅");
      return;
    }

    setTotalPoints((prev) => prev + 50);
    setLoggedDays((prev) => prev + 1);
    localStorage.setItem("lastLogin", today);
    setLastLogin(today);
    setLoginMessage("✅ Check-in successful! +50 points 🎉");
  };

  const redeemReward = (reward) => {
    if (totalPoints < rewardCosts[reward]) {
      alert("❌ Not enough points! Keep logging in to earn more.");
      return;
    }

    setTotalPoints((prev) => prev - rewardCosts[reward]);

    let message = "";
    if (reward === "1-minute stress buster tip") {
      message = stressBusterTips[Math.floor(Math.random() * stressBusterTips.length)];
    } else if (reward === "Nutri-Tip of the Day!") {
      message = nutriTips[Math.floor(Math.random() * nutriTips.length)];
    } else if (reward === "Knock-knock jokes") {
      message = jokes[Math.floor(Math.random() * jokes.length)];
    }

    alert(`🎁 Congrats! Here’s your reward:\n\n${message}`);
  };

  return (
    <div className="flex flex-col h-[100%] bg-gray-900 text-white overflow-auto">
      <header className="text-center py-6 bg-gray-800 shadow-lg">
        <h1 className="text-4xl font-bold">Rewards!</h1>
      </header>

      <main className="flex flex-col items-center w-full px-4">
        
        <section className="w-full max-w-2xl text-center bg-gray-800 p-6 rounded-lg shadow-md ">
          <h2 className="text-2xl font-semibold">Daily Login Bonus</h2>
          <p>Check in every day to earn <strong>50 points</strong>!</p>
          
          <div className="flex justify-center gap-3 ">
            {daysOfWeek.map((day, index) => (
              <span
                key={index}
                className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg ${
                  loggedDays[index] ? "bg-green-500" : "bg-gray-500"
                }`}
              >
                {day}
              </span>
            ))}
          </div>

          <button 
            onClick={handleDailyLogin} 
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg mt-2"
          >
            Check In
          </button>

          <p className="mt-2">{loginMessage}</p>
          <p className="font-bold text-lg mt-2">Your Total Points: <span className="text-yellow-400">{totalPoints}</span></p>
          <p className="text-lg mt-2">{loggedDays}/7 Achieved</p>
        </section>

        <section className="w-full max-w-2xl text-center bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold">Achievements & Badges</h2>
          <div className="flex justify-center gap-6 mt-4">
            <div className="bg-pink-500 p-4 rounded-full w-32 h-32 flex items-center justify-center text-lg font-bold">
              🥇 Beginner's Cardio
            </div>
            <div className="bg-yellow-500 p-4 rounded-full w-32 h-32 flex items-center justify-center text-lg font-bold">
              🏆 Weekly Consistency
            </div>
            <div className="bg-green-500 p-4 rounded-full w-32 h-32 flex items-center justify-center text-lg font-bold">
              🚀 Run 10km in a Week
            </div>
          </div>
        </section>

        <section className="w-full max-w-3xl text-center bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold">Redeemable Rewards</h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {Object.keys(rewardCosts).map((reward) => (
              <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col justify-between h-full items-center" key={reward}>
                <h4 className="text-lg font-semibold">{reward}</h4>
                <p className="text-yellow-400">Cost: {rewardCosts[reward]} points</p>
                <button 
                  onClick={() => redeemReward(reward)}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg mt-auto"
                >
                  Redeem
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Rewards;
