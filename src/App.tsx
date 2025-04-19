import React from "react";
import "./App.css";
import { DailyRecord } from "./pages/DailyRecord/index";
import { UIProvider } from "@yamada-ui/react";

function App() {
  return (
    <UIProvider>
      <div className="App">
        <DailyRecord />
      </div>
    </UIProvider>
  );
}

export default App;
