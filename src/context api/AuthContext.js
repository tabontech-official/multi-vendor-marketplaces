import { createContext, useReducer, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

// Reducer function to manage authentication state
export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload.token, data: action.payload.data };
    case 'LOGOUT':
      return { user: null, data: null };
    default:
      return state;
  }
};

const InitialState = ()=>{
  try {
    const storedUser = localStorage.getItem('user');
   if(storedUser){
    return{user:storedUser}
   }
  } catch (error) {
    console.error('Failed to parse user from local storage:', error);
    return{user:null}
  }
}

// AuthContextProvider component
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, InitialState());

  useEffect(() => {
      try {
       localStorage.setItem("user",JSON.stringify(state.user))
      } catch (error) {
        console.error('Failed to parse user from local storage:', error);
      }
  }, [])

  console.log('AuthContext state:', state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
