// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PantryRecipePage from "./pages/PantryRecipePage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PantryRecipePage />} />
        {/* In the future, you can add more pages here */}
      </Routes>
    </Router>
  );
};

export default App;
