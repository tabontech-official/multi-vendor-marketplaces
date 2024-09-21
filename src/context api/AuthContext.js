import { createContext, useReducer, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

// Reducer function to manage authentication state
export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload.token};
    case 'LOGOUT':
      localStorage.removeItem('usertoken');
      localStorage.removeItem('userid');
      localStorage.removeItem('email');
      return { user: null};
    default:
      return state;
  }
};

const InitialState = ()=>{
  try {
    const storedUser = localStorage.getItem('usertoken');
   if(storedUser){
    return{user:storedUser}
   }
  } catch (error) {
    return{user:null}
  }
}

// AuthContextProvider component
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, InitialState());

  useEffect(() => {
      try {
       localStorage.setItem("usertoken",state.user)
      } catch (error) {
        console.error('Failed to parse user from local storage:', error);
      }
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
