import { useContext } from "react";
import { MembersContext } from "../context/Membercontext";
const useMemberhook = () => {
  const context = useContext(MembersContext);

  if (!context) {
    throw new Error(
      "useEmergencyHook must be used within an EmergencyProvider"
    );
  }

  return context;
};

export default useMemberhook;
