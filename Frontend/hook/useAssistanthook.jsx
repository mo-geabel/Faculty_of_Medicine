import { useContext } from "react";
import { AssistantsContext } from "../context/AssistantContext";
const useAssistanthook = () => {
  const context = useContext(AssistantsContext);

  if (!context) {
    throw new Error(
      "useEmergencyHook must be used within an EmergencyProvider"
    );
  }

  return context;
};

export default useAssistanthook;
