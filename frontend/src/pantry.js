import React, { useState, useEffect } from "react";
import API from "./api";
import "./style.css";
import Sidebar from './Sidebar';
import { XCircle, AlertTriangle, CheckCircle2, Trash2, Plus } from "lucide-react";

function Pantry() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dateType, setDateType] = useState("bought"); // New State
  const [inputDate, setInputDate] = useState(""); // Replaces addedDate
  const [items, setItems] = useState([]);

  // FETCH ITEMS
  const fetchItems = async () => {
    try {
      const res = await API.get("/items");
      setItems(res.data.items || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ADD ITEM
  const handleAdd = async () => {
    if (!name || !quantity || !inputDate) {
      alert("Fill all fields");
      return;
    }

    try {
      await API.post("/add-item", {
        name,
        quantity,
        date_type: dateType,
        input_date: inputDate,
      });

      setName("");
      setQuantity("");
      setInputDate("");
      setShowForm(false);
      fetchItems();
    } catch (err) {
      alert("Error adding item");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    await API.delete(`/delete-item/${id}`);
    fetchItems();
  };

  // DAYS CALC
  const getDaysLeft = (date) => {
    const today = new Date();
    const exp = new Date(date);
    return Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  };

  // DISPLAY TEXT
  const getDisplayText = (days) => {
    if (days < 0) return `Expired ${Math.abs(days)} day(s) ago`;
    if (days === 0) return "Expires today";
    return `${days} day(s) left`;
  };

  // SPLIT ITEMS
  const expiredItems = items.filter(i => getDaysLeft(i.expiry_date) < 0);
  const expiringItems = items.filter(i => {
    const d = getDaysLeft(i.expiry_date);
    return d >= 0 && d <= 2;
  });
  const otherItems = items.filter(i => getDaysLeft(i.expiry_date) > 2);

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main">
        <div className="pantry-header">
          <div>
            <h1>Smart Pantry</h1>
            <p>Manage your ingredients and prevent waste.</p>
          </div>

          <button className="add-btn" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} style={{marginRight: '8px'}} /> Add Ingredient
          </button>
        </div>

        {/* UPDATED FORM AREA */}
        {showForm && (
          <div className="add-form" style={{ flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", width: "100%" }}>
              <input
                placeholder="Item name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ flex: 1, margin: 0, padding: "12px", borderRadius: "10px", border: "2px solid var(--border-light)" }}
              />

              <input
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{ width: "100px", margin: 0, padding: "12px", borderRadius: "10px", border: "2px solid var(--border-light)" }}
              />

              {/* NEW DROPDOWN */}
              <select 
                value={dateType} 
                onChange={(e) => setDateType(e.target.value)}
                style={{ padding: "12px", borderRadius: "10px", border: "2px solid var(--border-light)", outline: "none", backgroundColor: "white" }}
              >
                <option value="bought">Bought Date</option>
                <option value="expiry">Expiry Date</option>
              </select>

              <input
                type="date"
                style={{margin: 0, padding: "12px", borderRadius: "10px", border: "2px solid var(--border-light)"}}
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
              />

              <button onClick={handleAdd} className="add-btn-small" style={{whiteSpace: "nowrap"}}>
                <Plus size={16} style={{marginRight: '8px'}} />Add Item
              </button>
            </div>
            
            {/* HELPFUL UI HINT */}
            <small style={{ color: "#718096", fontStyle: "italic", marginTop: "5px" }}>
              💡 <strong>Tip:</strong> Choose "Expiry Date" directly for packaged products!
            </small>
          </div>
        )}

        {/* EXPIRED */}
        <h3 className="section-title expired">
          Expired Items ({expiredItems.length})
        </h3>
        <div className="pantry-list-view">
          {expiredItems.map(item => {
            const days = getDaysLeft(item.expiry_date);
            return (
              <div className="list-item expired-item" key={item.id}>
                <h3 style={{display: 'flex', alignItems: 'center', gap: '8px'}}><XCircle size={20} color="var(--red)" /> {item.name} <span style={{fontSize: "14px", color: "var(--text-muted)", fontWeight: "normal"}}>({item.quantity})</span></h3>
                <p>{getDisplayText(days)}</p>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            );
          })}
        </div>

        {/* EXPIRING */}
        <h3 className="section-title expiring">
          Expiring Soon ({expiringItems.length})
        </h3>
        <div className="pantry-list-view">
          {expiringItems.map(item => {
            const days = getDaysLeft(item.expiry_date);
            return (
              <div className="list-item" key={item.id}>
                <h3 style={{display: 'flex', alignItems: 'center', gap: '8px'}}><AlertTriangle size={20} color="var(--orange)" /> {item.name} <span style={{fontSize: "14px", color: "var(--text-muted)", fontWeight: "normal"}}>({item.quantity})</span></h3>
                <p>{getDisplayText(days)}</p>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            );
          })}
        </div>

        {/* ALL */}
        <h3 className="section-title">All Ingredients</h3>
        <div className="pantry-list-view">
          {otherItems.map(item => {
            const days = getDaysLeft(item.expiry_date);
            return (
              <div className="list-item" key={item.id}>
                <h3 style={{display: 'flex', alignItems: 'center', gap: '8px'}}><CheckCircle2 size={20} color="var(--green)" /> {item.name} <span style={{fontSize: "14px", color: "var(--text-muted)", fontWeight: "normal"}}>({item.quantity})</span></h3>
                <p>{getDisplayText(days)}</p>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default Pantry;