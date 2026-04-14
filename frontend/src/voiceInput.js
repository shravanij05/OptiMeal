import React, { useState } from "react";
import "./style.css";

const VoiceInput = () => {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);

  // 🎤 Start Listening
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setText(transcript);
      setListening(false);

      const parsed = parseIngredients(transcript);
      setItems(parsed);
    };

    recognition.onerror = () => {
      setListening(false);
      alert("Error in voice input");
    };
  };

  // 🧠 CLEAN PARSER
  const parseIngredients = (speech) => {
  const numberWords = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
  };

  const parts = speech.split(",");
  const result = [];

  parts.forEach((item) => {
    let text = item.toLowerCase();

    // 🔢 Convert words → numbers
    Object.keys(numberWords).forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "g");
      text = text.replace(regex, numberWords[word]);
    });

    // 📦 Quantity
    const quantityMatch = text.match(/\d+\s?(kg|g|grams|litre|l)?/);
    const quantity = quantityMatch ? quantityMatch[0] : "1";

    // ⏳ Expiry
    const expiryMatch = text.match(/(\d+)\s?(day|days)/);
    const expiryDays = expiryMatch ? parseInt(expiryMatch[1]) : 7;

    // 🍽 CLEAN NAME
    let name = text
      .replace(quantityMatch?.[0] || "", "")
      .replace(expiryMatch?.[0] || "", "")
      .replace(/expiring|in|days?|day|kg|grams|g|litre|l/g, "")
      .replace(/\d+/g, "")
      .trim();

    // 👉 FINAL CLEAN: take LAST meaningful word
    const words = name.split(" ").filter(w => w.length > 2);
    name = words[words.length - 1] || "item";

    // 📅 Expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    result.push({
      name,
      quantity,
      expiry: expiryDate.toISOString().split("T")[0],
    });
  });

  return result;
};

  // 📦 SAVE TO PANTRY (localStorage)
  const handleAdd = () => {
    const existing = JSON.parse(localStorage.getItem("pantry")) || [];

    const updated = [...existing, ...items];

    localStorage.setItem("pantry", JSON.stringify(updated));

    alert("✅ Added to Pantry!");

    setText("");
    setItems([]);
  };

  return (
    <div className="voice-input-container" style={{ position: "relative", display: "inline-block" }}>
    
      {/* 🎤 BUTTON */}
      <button
        className={`primary ${listening ? "active" : ""}`}
        onClick={startListening}
        style={listening ? { background: "var(--red)", boxShadow: "0 0 25px var(--red-glow)", animation: "pulse 1.2s infinite" } : {}}
      >
        {listening ? "Listening..." : "Start Speaking"}
      </button>

      {/* 📝 RESULT / CARD DIV */}
      {(listening || text) && (
        <div className="voice-card" style={{ position: "absolute", top: "0", left: "calc(100% + 20px)", zIndex: 100 }}>
          {listening && !text && <p style={{ textAlign: "center", margin: 0, fontWeight: "600", color: "var(--text-main)" }}>Microphone is on. Speak now...</p>}
          
          {text && (
            <div className="result-box">
              <p><strong>You said:</strong> {text}</p>

              {/* CLEAN ITEMS */}
              {items.map((item, index) => (
                <div key={index} className="item" style={{ padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <p style={{margin: '4px 0'}}>🍽 {item.name}</p>
                  <p style={{margin: '4px 0'}}>📦 {item.quantity}</p>
                  <p style={{margin: '4px 0'}}>⏳ {item.expiry}</p>
                </div>
              ))}

              <button className="add-btn" onClick={handleAdd} style={{ width: '100%', marginTop: '15px' }}>
                Add to Pantry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;