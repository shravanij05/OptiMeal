import React, { useState } from "react";
import API from "./api";
import "./style.css";
import Sidebar from './Sidebar';
import toast from 'react-hot-toast';

function Recipes() {
  const [input, setInput] = useState("");
  const [diet, setDiet] = useState(""); 
  const [cuisine, setCuisine] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async (usePantry = false) => {
    setLoading(true);
    try {
      const payload = usePantry 
        ? { use_pantry: true, diet: diet, cuisine: cuisine }
        : { ingredients: input.split(",").map(item => item.trim()), diet: diet, cuisine: cuisine };

      const res = await API.post("/api/recommendations", payload);
      
      if (res.data.status === "success") {
        setRecipes(res.data.recipes);
        toast.success("Recipes fetched successfully!");
      } else {
        toast.error(res.data.error || "Something went wrong!");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Ensure your backend is running and API key is valid.");
    } finally {
      setLoading(false);
    }
  };

  const markAsCooked = async (recipe) => {
    try {
      await API.post("/api/meals/log", { user_id: 1, recipe_id: recipe.id, title: recipe.title });
      toast.success(`Logged "${recipe.title}" to your Sustainability Dashboard!`);
    } catch (err) {
      toast.error("Error saving meal.");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main">
        <h1>Recipe Recommendations</h1>
        <p>Cook with what you have, waste less food.</p>

        <div className="card" style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            placeholder="Type ingredients (e.g. chicken, spinach)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          
          <select value={diet} onChange={(e) => setDiet(e.target.value)} style={{ padding: "10px", borderRadius: "5px" }}>
            <option value="">Any Diet</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>

          <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} style={{ padding: "10px", borderRadius: "5px" }}>
            <option value="">Any Cuisine</option>
            <option value="Indian">Indian</option>
            <option value="Chinese">Chinese</option>
            <option value="Mexican">Mexican</option>
            <option value="Mediterranean">Mediterranean</option>
            <option value="Italian">Italian</option>
          </select>

          <button onClick={() => fetchRecipes(false)} className="primary" style={{ padding: "10px 20px" }}>
            {loading ? "Searching..." : "Find Matches"}
          </button>
          
          <button onClick={() => fetchRecipes(true)} className="add-btn-small" style={{ background: "linear-gradient(135deg, #2b6cb0, #2c5282)", padding: "14px 24px" }}>
            {loading ? "Scanning..." : "Auto-Search from Pantry"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {recipes.map((recipe) => (
            <div className="card" key={recipe.id} style={{ padding: "0", overflow: "hidden" }}>
              <img src={recipe.image} alt={recipe.title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
              <div style={{ padding: "15px" }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>{recipe.title}</h3>
                <p style={{ margin: "0", color: recipe.matchPercentage >= 80 ? "#2f855a" : "#dd6b20", fontWeight: "bold" }}>
                  {recipe.matchTier} ({recipe.matchPercentage}%)
                </p>
                <div style={{ marginBottom: "15px", minHeight: "40px" }}>
                  <small style={{ display: "block", color: "#4a5568", fontWeight: "bold" }}>
                    Missing {recipe.missingCount} ingredients
                  </small>

                  {recipe.missingCount > 0 && (
                    <small style={{ display: "block", color: "#e53e3e", fontStyle: "italic", lineHeight: "1.3", marginTop: "4px" }}>
                      To buy: {recipe.missingIngredientsList}
                    </small>
                  )}
                </div>                
                <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                  <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" style={{ textAlign: "center", padding: "8px", backgroundColor: "#e2e8f0", color: "black", textDecoration: "none", borderRadius: "5px" }}>
                    View Full Recipe ↗
                  </a>
                  <button onClick={() => markAsCooked(recipe)} style={{ padding: "8px", backgroundColor: "#81b190", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
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

export default Recipes;