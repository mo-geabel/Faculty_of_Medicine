import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AnnouncementProvider } from "../context/AnnouncmentContext";
import { AchievementProvider } from "../context/AchievementContext";
import { EmergencyContextProvider } from "../context/EmergencyContext";
import { MembersContextProvider } from "../context/Membercontext";
import { AssistantsContextProvider } from "../context/AssistantContext";
import { LoginContextProvider } from "../context/UserContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoginContextProvider>
      <AssistantsContextProvider>
        <MembersContextProvider>
          <EmergencyContextProvider>
            <AchievementProvider>
              <AnnouncementProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </AnnouncementProvider>
            </AchievementProvider>
          </EmergencyContextProvider>
        </MembersContextProvider>
      </AssistantsContextProvider>
    </LoginContextProvider>
  </React.StrictMode>
);
