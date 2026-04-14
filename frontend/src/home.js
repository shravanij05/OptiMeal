import React from "react";
import {  useNavigate } from "react-router-dom";
import "./style.css";
import Sidebar from './Sidebar';
import { Leaf } from "lucide-react";
import VoiceInput from "./voiceInput";
function Home() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">

      <Sidebar />

      {/*  MAIN CONTENT */}
      <div className="main">

        {/* HERO SECTION */}
        <div className="hero">
          <span className="tag"><Leaf size={16} /> Smart Living</span>

          <h1>
            Reduce Food Waste.<br />
            <span>Eat Smart.</span> Live Sustainable.
          </h1>

          <p>
            Your AI-powered household assistant. Track ingredients,
            discover zero-waste recipes, and build a greener future one meal at a time.
          </p>

          <div className="hero-buttons">
            <button
              className="primary"
              onClick={() => navigate("/pantry")}  //  IMPORTANT
            >
              Start Planning →
            </button>

            <VoiceInput />
          </div>
        </div>

        {/* FEATURE CARDS */}
        <div className="cards">

          <div className="card">
            <h3>Smart Pantry</h3>
            <p>
              Keep track of what's in your fridge. Get expiry alerts and reduce waste.
            </p>
          </div>

          <div className="card">
            <h3>Recipe Matching</h3>
            <p>
              Discover meals that use ingredients you already have.
            </p>
          </div>

          <div className="card">
            <h3>Sustainability Tracking</h3>
            <p>
              Track your savings, meals saved, and environmental impact.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Home;