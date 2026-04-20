import { createContext, useReducer } from "react";

export const LoginContext = createContext();

export const LoginContextProvider = ({ children }) => {
  const LoginReducer = (state, action) => {
    switch (action.type) {
      case "LOGIN":
        return { ...state, User: action.payload };
      case "LOGOUT":
        return {
          User: [],
        };

      default:
        return state;
    }
  };

  // Initial state and useReducer hook
  const initialState = {
    User: [],
  };
  const [state, dispatch] = useReducer(LoginReducer, initialState);
  return (
    <LoginContext.Provider value={{ User: state.User, dispatch }}>
      {children}
    </LoginContext.Provider>
  );
};
