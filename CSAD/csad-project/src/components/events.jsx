import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

const events = [
	{ id: 0, colorCard: "30,41,57", title: "Basketball", image: "/image/basketball.jpeg", description: "Join an exciting basketball game and showcase your skills on the court!" },
	{ id: 1, colorCard: "30,41,57", title: "Badminton", image: "/image/bdminton.jpeg", description: "Compete in fast-paced badminton matches and enjoy a fun workout." },
	{ id: 2, colorCard: "30,41,57", title: "Bouldering", image: "/image/bouldering.jpg", description: "Challenge yourself with indoor or outdoor rock climbing adventures!" },
	{ id: 3, colorCard: "30,41,57", title: "Bowling", image: "/image/bowling.jpg", description: "Strike it big in a friendly bowling match! Perfect for all skill levels." },
	{ id: 4, colorCard: "30,41,57", title: "Canoe Sprint", image: "/image/canoesprint.jpeg", description: "Race across the water and test your endurance in a thrilling canoe sprint!" },
	{ id: 5, colorCard: "30,41,57", title: "Cycling", image: "/image/Cycling.jpg", description: "Experience a fun cycling adventure across beautiful landscapes!" },
	{ id: 6, colorCard: "30,41,57", title: "Soccer", image: "/image/soccer.jpeg", description: "Join a competitive soccer match and experience the thrill of the game!" },
	{ id: 7, colorCard: "30,41,57", title: "Yoga", image: "/image/yoga.jpg", description: "Relax and strengthen your body with a peaceful yoga session." },
	{ id: 8, colorCard: "30,41,57", title: "Volleyball", image: "/image/volleyball.jpeg", description: "Bump, set, and spike your way to victory in an exciting volleyball match!" },
	{ id: 9, colorCard: "30,41,57", title: "Swimming", image: "/image/swimming.jpg", description: "Enjoy a refreshing swim and enhance your skills with expert trainers." },
	{ id: 10, colorCard: "30,41,57", title: "Softball", image: "/image/softball.jpg", description: "Hit a home run in a fun and competitive softball game!" },
	{ id: 11, colorCard: "30,41,57", title: "Mountain Biking", image: "/image/MountainBiking.jpg", description: "Take on the challenge of mountain biking on thrilling terrains." },
	{ id: 12, colorCard: "30,41,57", title: "Jogging", image: "/image/jogging.jpg", description: "Join us for an exciting jogging event! Improve your stamina and meet new friends." },
	{ id: 13, colorCard: "30,41,57", title: "Skating", image: "/image/inlineskate.jpeg", description: "Glide through the rink or streets with our exciting skating event!" },
  ];

  const EventPopup = ({ event, onClose }) => {
	if (!event) return null; 
  
	return (
	  <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
		<div className="bg-[#16212d] rounded-lg shadow-lg max-w-md w-full p-6 relative">
		  <button 
			className="absolute top-3 right-3 text-white hover:text-gray-800"
			onClick={onClose}
		  >
			✖
		  </button>
  
		  <img 
			src={event.image} 
			alt={event.title} 
			className="w-full h-full object-cover rounded-lg"
		  />
  
		  <h2 className="text-2xl font-bold text-white mt-4">
			{event.title}
		  </h2>
  
		  <p style={{color: "white"}} className="mt-2">
			{event.description}
		  </p>
  
		  <button 
			className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
			onClick={() => toast.success(`Signed up for ${event.title}!`, { position: "top-center" })}
		  >
			Sign Up
		  </button>
		</div>
	  </div>
	);
  };
  const Events = () => {
	const [selectedEvent, setSelectedEvent] = useState(null);

	const handleClick = (event) => {
	  setSelectedEvent(event); 
	};

  return (
    <StyledWrapper>
    <p style={{textAlign: "center", color: "white", fontSize: "2rem"}}>Pick an event to join!</p>
      <div className="wrapper">
        <div className="inner" style={{ "--quantity": events.length }}>
          {events.map((event) => (
            <div
              key={event.id}
              className="card"
              style={{ "--index": event.id, "--color-card": event.colorCard }}
              onClick={() => handleClick(event)} // Click event
            >
              <div className="card-content">
                <img src={event.image} alt={event.title} className="event-image" />
                <h3 className="title">{event.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
	  {selectedEvent && <EventPopup event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .wrapper {
    width: 100%;
    height: 100vh;
    position: relative;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .inner {
    --w: 200px;
    --h: 200px;
    --translateZ: calc((var(--w) + var(--h)) * 1.3);
    --rotateX: -5deg;
    --perspective: 1200px;
    position: absolute;
    width: var(--w);
    height: var(--h);
    top: 25%;
    left: calc(50% - (var(--w) / 2));
    z-index: 2;
    transform-style: preserve-3d;
    transform: perspective(var(--perspective));
    animation: rotating 40s linear infinite; /* Adjust speed */
  }

  @keyframes rotating {
    from {
      transform: perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(0);
    }
    to {
      transform: perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(1turn);
    }
  }

  .card {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    inset: 0;
    transform: rotateY(calc(360deg / var(--quantity) * var(--index))) translateZ(var(--translateZ));
    cursor: pointer;
    transition: transform 0.3s ease-in-out;
  }

  .card:hover {
    transform: rotateY(calc(360deg / var(--quantity) * var(--index))) translateZ(var(--translateZ)) scale(1.1);
  }

  .card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(var(--color-card), 1);
    width: 100%;
    height: 100%;
    padding: 10px;
    color: white;
    text-align: center;
    font-weight: bold;
  }

  .event-image {
    width: 100%;
    height: 140px; 
    object-fit: cover; 
    border-radius: 8px;
  }

  .title {
    margin-top: 10px;
    font-size: 14px;
    color: white;
  }
`;


export default Events;
