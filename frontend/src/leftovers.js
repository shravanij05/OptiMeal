import React, { useState } from "react";
import API from "./api";
import "./style.css";
import Sidebar from './Sidebar';
import toast from 'react-hot-toast';

function Leftovers() {
  const [leftoversInput, setLeftoversInput] = useState("");
  const [diet, setDiet] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchZeroWasteRecipes = async () => {
    if (!leftoversInput.trim()) {
      toast.error("Please enter what leftovers you have!");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/api/leftovers/generate", {
        leftovers: leftoversInput,
        diet: diet
      });
      if (res.data.status === "success") {
        setRecipes(res.data.recipes);
        toast.success("Recipes generated successfully!");
      } else {
        toast.error(res.data.error || "Something went wrong!");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to connect to the generator.");
    } finally {
      setLoading(false);
    }
  };

  const markAsCooked = async (recipe) => {
    try {
      await API.post("/api/meals/log", { user_id: 1, recipe_id: recipe.id, title: recipe.title });
      toast.success(`Successfully logged "${recipe.title}"!`);
    } catch (err) {
      toast.error("Error saving meal.");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main" style={{ textAlign: "center" }}>
        <h1>Leftover Magic</h1>
        <p>Tell us what cooked food you have left. We will check your Pantry and invent a brand new meal.</p>

        <div className="card" style={{ maxWidth: "600px", margin: "20px auto", textAlign: "center" }}>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "10px" }}>
              What cooked food needs to be used up?
            </label>
            <input
              type="text"
              placeholder="e.g. Boiled Pasta"
              value={leftoversInput}
              onChange={(e) => setLeftoversInput(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px" }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center", marginBottom: "15px" }}>
            <span style={{ fontWeight: "bold" }}>Diet Filter:</span>
            <select value={diet} onChange={(e) => setDiet(e.target.value)} style={{ padding: "10px", borderRadius: "5px" }}>
              <option value="">Any Diet</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>

          <button className="primary" onClick={fetchZeroWasteRecipes} style={{ width: "100%", padding: "12px", fontSize: "16px" }}>
            {loading ? "Generating..." : "Invent a Recipe"}
          </button>
        </div>

        {/* RESULTS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", textAlign: "left" }}>
          {recipes.map((recipe, idx) => (
             <div className="card" key={recipe.id || idx} style={{ padding: "0", overflow: "hidden" }}>
             <div style={{ padding: "15px" }}>
               <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>{recipe.title}</h3>
               <p style={{ margin: "0 0 10px 0", color: "#805ad5", fontWeight: "bold" }}>Custom Recipe</p>
               
               <div style={{ backgroundColor: "#faf5ff", padding: "10px", borderRadius: "5px", marginBottom: "15px", fontSize: "14px", color: "#4a5568" }}>
                 <strong>How to make it:</strong> <br/>
                 {recipe.instructions}
               </div>
               
               <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                  <button onClick={() => markAsCooked(recipe)} style={{ padding: "10px", backgroundColor: "#81b190", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                    Mark as Cooked
                  </button>
                </div>
             </div>
           </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Leftovers;