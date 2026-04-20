import { useContext } from "react";
import { LoginContext } from "../context/UserContext";
const useLoginhook = () => {
  const context = useContext(LoginContext);

  if (!context) {
    throw new Error(
      "useEmergencyHook must be used within an EmergencyProvider"
    );
  }

  return context;
};

export default useLoginhook;
