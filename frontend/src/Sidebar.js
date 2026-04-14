import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Home, Package, ShoppingCart, Utensils, 
  Calendar, Recycle, Bell, Settings, 
  Globe, BarChart2, LogOut, Leaf
} from "lucide-react";
import "./style.css";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2 className="logo">
        <Leaf className="sidebar-icon-logo" size={28} /> OptiMeal
      </h2>

      <nav className="nav">
        <NavLink to="/home" className="nav-item">
          <Home className="sidebar-icon" size={20} /> Home
        </NavLink>
        <NavLink to="/pantry" className="nav-item">
          <Package className="sidebar-icon" size={20} /> Pantry
        </NavLink>
        <NavLink to="/grocery" className="nav-item">
          <ShoppingCart className="sidebar-icon" size={20} /> Grocery
        </NavLink>
        <NavLink to="/recipes" className="nav-item">
          <Utensils className="sidebar-icon" size={20} /> Recipes
        </NavLink>
        <NavLink to="/meal-planner" className="nav-item">
          <Calendar className="sidebar-icon" size={20} /> Meal Planner
        </NavLink>
        <NavLink to="/leftovers" className="nav-item">
          <Recycle className="sidebar-icon" size={20} /> Leftovers
        </NavLink>
        <NavLink to="/alert" className="nav-item">
          <Bell className="sidebar-icon" size={20} /> Alerts
        </NavLink>

        <NavLink to="/sustainability" className="nav-item">
          <Globe className="sidebar-icon" size={20} /> Nutrition Intake
        </NavLink>
        <NavLink to="/post-waste" className="nav-item">
          <BarChart2 className="sidebar-icon" size={20} /> Post-Waste
        </NavLink>
        <NavLink to="/settings" className="nav-item">
          <Settings className="sidebar-icon" size={20} /> Settings
        </NavLink>
      </nav>

      <div>


        <button 
          className="logout"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          <LogOut size={18} className="logout-icon" /> Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
