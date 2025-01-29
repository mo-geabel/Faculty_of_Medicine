import { useContext } from "react";
import { EmergencyContext } from "../context/EmergencyContext";
const useEmergencyHook = () => {
  const context = useContext(EmergencyContext);

  if (!context) {
    throw new Error(
      "useEmergencyHook must be used within an EmergencyProvider"
    );
  }

  return context;
};

export default useEmergencyHook;
