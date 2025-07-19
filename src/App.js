import React, { useState, useEffect } from "react";
import confetti from 'canvas-confetti';
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [celebrating, setCelebrating] = useState(null);
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem("reminders");
    return saved ? JSON.parse(saved) : [];
  });

  // savinig reminders (dates that are filled or submitted till yet) to local storage
  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  // Birthdays-checking
  useEffect(() => {
    const today = new Date().toISOString().slice(5, 10); // MM-DD
    reminders.forEach((r) => {
      if (r.birthdate.slice(5, 10) === today && !r.rangToday) {
        celebrateBirthday(r.name);
        r.rangToday = true;
        setReminders([...reminders]);
      }
    });
  }, []);

  const celebrateBirthday = (name) => {
    playSound();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    setCelebrating(name);
  };

  const playSound = () => {
    const audio = new Audio(process.env.PUBLIC_URL + "/birthday.mp3");
    audio.play().catch(e => console.log("Audio play failed:", e));
  };

  const calculateAge = (dob) => {
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const isBeforeBirthday = (
      now.getMonth() < birth.getMonth() ||
      (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
    );
    if (isBeforeBirthday) age--;
    return age;
  };

  const handleAdd = () => {
    if (!name || !birthdate) return;
    setReminders([
      ...reminders,
      { name, birthdate, rangToday: false },
    ]);
    setName("");
    setBirthdate("");
  };

  const formatDate = (dateStr) => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  const handleDelete = (index) => {
    const newReminders = [...reminders];
    newReminders.splice(index, 1);
    setReminders(newReminders);
  };

  return (
    <div className="app-container">
      <Balloons />
      
      {celebrating && (
        <div className="celebration-modal">
          <div className="celebration-content">
            <h2>🎉 Happy Birthday, {celebrating}! 🎉</h2>
            <button onClick={() => setCelebrating(null)}>Close</button>
          </div>
        </div>
      )}

      <div className="content">
        <h1>🎂 Birthday Reminder</h1>
        <div className="form">
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
          <button onClick={handleAdd}>Add Birthday</button>
        </div>

        <div className="reminders">
          {reminders.map((r, i) => {
            const isToday = r.birthdate.slice(5, 10) === new Date().toISOString().slice(5, 10);
            return (
              <div key={i} className={`card ${isToday ? 'today' : ''}`}>
                <div className="card-content">
                  <h2>{r.name}</h2>
                  <p>
                    Turns <strong>{calculateAge(r.birthdate)}</strong> on{" "}
                    <strong>{formatDate(r.birthdate)}</strong>
                  </p>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(i)}>×</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const Balloons = () => {
  const [balloons, setBalloons] = useState(
    Array(15).fill(0).map(() => ({
      left: Math.random() * 100,
      color: `hsl(${Math.random() * 360}, 100%, 75%)`,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 5,
      key: Math.random().toString(36).substring(7)
    }))
  );

  const resetBalloon = (index) => {
    setBalloons(prev => {
      const newBalloons = [...prev];
      newBalloons[index] = {
        left: Math.random() * 100,
        color: `hsl(${Math.random() * 360}, 100%, 75%)`,
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 5,
        key: Math.random().toString(36).substring(7)
      };
      return newBalloons;
    });
  };

  return (
    <div className="balloons">
      {balloons.map((balloon, i) => (
        <div 
          key={balloon.key}
          className="balloon"
          style={{
            left: `${balloon.left}%`,
            background: balloon.color,
            animationDuration: `${balloon.duration}s`,
            animationDelay: `${balloon.delay}s`
          }}
           onClick={() => {
            resetBalloon(i);
            confetti({
              particleCount: 20,
              spread: 70,
              origin: { 
                x: balloon.left / 100,
                y: 0.8
              }
            });
          }}  
        />
      ))}
    </div>
  );
};

export default App;
