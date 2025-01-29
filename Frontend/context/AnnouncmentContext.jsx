import { createContext, useReducer } from "react";

// Create the context
const AnnouncementContext = createContext();
export default AnnouncementContext;

// Provider Component
export const AnnouncementProvider = ({ children }) => {
  // Reducer function
  const announcementReducer = (state, action) => {
    switch (action.type) {
      case "GET_ANNOUNCEMENTS":
        return { ...state, announcements: action.payload };
      case "CREATE_ANNOUNCEMENT":
        return {
          ...state,
          announcements: [...state.announcements, action.payload],
        };
      case "UPDATE_ANNOUNCEMENT":
        return {
          ...state,
          announcements: state.announcements.map((announcement) =>
            announcement._id === action.payload._id
              ? action.payload
              : announcement
          ),
        };
      case "DELETE_ANNOUNCEMENT":
        return {
          ...state,
          announcements: state.announcements.filter(
            (announcement) => announcement._id !== action.payload
          ),
        };
      default:
        return state;
    }
  };

  // Initial state and useReducer hook
  const initialState = {
    announcements: [],
  };
  const [state, dispatch] = useReducer(announcementReducer, initialState);

  // Provide context value
  return (
    <AnnouncementContext.Provider
      value={{ announcements: state.announcements, dispatch }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};
