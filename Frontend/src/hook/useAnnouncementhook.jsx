import AnnouncementContext from "../context/AnnouncementContext";
import { useContext } from "react";

const useAnnouncementContexthook = () => {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error(
      "useAnnouncementhook must be used within a AnnouncementProvider"
    );
  }
  return context;
};
export default useAnnouncementContexthook;
