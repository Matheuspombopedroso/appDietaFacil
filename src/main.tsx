import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import DailyEntry from "./pages/DailyEntry";
import Progress from "./pages/Progress";
import Calendar from "./pages/Calendar";
import Goals from "./pages/Goals";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<DailyEntry />} />
          <Route path="progress" element={<Progress />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="goals" element={<Goals />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
