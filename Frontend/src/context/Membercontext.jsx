import { createContext, useReducer } from "react";

export const MembersContext = createContext();

export const MembersContextProvider = ({ children }) => {
  const MembersReducer = (state, action) => {
    switch (action.type) {
      case "GET_Members":
        return { ...state, Members: action.payload };
      case "CREATE_Members":
        return {
          ...state,
          Members: [...state.Members, action.payload],
        };
      case "UPDATE_Members":
        return {
          ...state,
          Members: state.Members.map((member) =>
            member._id === action.payload._id
              ? { ...member, ...action.payload.data }
              : member
          ),
        };

      case "DELETE_Members":
        return {
          ...state,
          Members: state.Members.filter(
            (member) => member._id !== action.payload
          ),
        };
      default:
        return state;
    }
  };

  // Initial state and useReducer hook
  const initialState = {
    Members: [],
  };
  const [state, dispatch] = useReducer(MembersReducer, initialState);
  return (
    <MembersContext.Provider value={{ Members: state.Members, dispatch }}>
      {children}
    </MembersContext.Provider>
  );
};
