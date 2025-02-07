import React, { useState, useEffect } from "react";
import './rewards.css'
const Rewards = () => {
  // Load points and login data from localStorage
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
    <div className="rewards-container">
      <header style={{ backgroundColor: "#1c2633", color: "white" }}>
        <h1>Rewards!</h1>
      </header>
      <main>
        {/* Daily Login Section */}
        <section className="daily-login" style={{ backgroundColor: "#1c2633", color: "white" }}>
          <h2>Daily Login Bonus</h2>
          <p>Check in every day to earn <strong>50 points</strong>!</p>
          <div className="week-tracker">
            {daysOfWeek.map((day, index) => (
              <span
                key={index}
                className={`day-circle ${loggedDays[index] ? "active" : ""}`}
                style={{
                  backgroundColor: loggedDays[index] ? "green" : "#ccc",
                  color: "white",
                }}
              >
                {day}
              </span>
            ))}
          </div>
          <button onClick={handleDailyLogin}>Check In</button>
          <p id="loginMessage" style={{ color: "white" }}>{loginMessage}</p>
          <p><b>Your Total Points:</b> <strong>{totalPoints}</strong> points collected</p>
          <p className="progress-count">{loggedDays}/7 Achieved</p>
        </section>

        {/* Achievements & Badges */}
        <section className="achievements" style={{ backgroundColor: "#1c2633", color: "white" }}>
          <h2 style={{ color: "white" }}>Achievements & Badges</h2>
          <div className="badges-grid">
            <div className="badge-card"><span className="badge-icon">🥇</span> Beginner's Cardio Medal</div>
            <div className="badge-card"><span className="badge-icon">🏆</span> Weekly Consistency</div>
            <div className="badge-card"><span className="badge-icon">🚀</span> Run 10km in a Week</div>
          </div>
        </section>

        {/* Redeemable Rewards */}
        <section className="redeemable-rewards" style={{ backgroundColor: "#1c2633", color: "white" }}>
          <h2>Redeemable Rewards</h2>
          <div className="rewards-grid">
            {Object.keys(rewardCosts).map((reward) => (
              <div className="reward-card" key={reward} style={{backgroundColor: "#1c2633", color: "white"}}>
                <h4>{reward}</h4>
                <p>Cost: {rewardCosts[reward]} points</p>
                <button onClick={() => redeemReward(reward)}>Redeem</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Rewards;
