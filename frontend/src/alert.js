import React, { useEffect, useState } from "react";

import API from "./api";
import "./style.css";
import Sidebar from './Sidebar';

function Alerts() {
  
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = async () => {
    const res = await API.get("/alerts");
    setAlerts(res.data);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const getText = (days) => {
    if (days < 0) return `Expired ${Math.abs(days)} day(s) ago`;
    if (days === 0) return "Expires today";
    return `${days} day(s) left`;
  };

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="main">
        <h1> Alerts</h1>

        {alerts.length === 0 ? (
          <p>No alerts </p>
        ) : (
          alerts.map((a) => (
            <div className="alert-card" key={a.id}>
              <h3> {a.name}</h3>
              <p>{getText(a.days_left)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Alerts;