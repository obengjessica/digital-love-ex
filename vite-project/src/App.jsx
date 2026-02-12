import React from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Created from "./pages/Created";
import LovePage from "./pages/LovePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/created" element={<Created />} />
      <Route path="/love/:slug" element={<LovePage />} />
    </Routes>
  );
}

export default App;
