import AnnouncmentContext from "../context/AnnouncmentContext";
import { useContext } from "react";

const useAnnouncmentContexthook = () => {
  const context = useContext(AnnouncmentContext);
  if (!context) {
    throw new Error(
      "useAchievementhook must be used within a AchievementProvider"
    );
  }
  return context;
};
export default useAnnouncmentContexthook;
