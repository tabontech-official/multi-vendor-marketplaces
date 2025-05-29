// import { createContext, useReducer, useEffect } from 'react';

// // Create the context
// export const AuthContext = createContext();

// // Reducer function to manage authentication state
// export const authReducer = (state, action) => {
//   switch (action.type) {
//     case 'LOGIN':
//       return { user: action.payload.token};
//     case 'LOGOUT':
//       localStorage.removeItem('usertoken');
//       localStorage.removeItem('userid');
//       localStorage.removeItem('email');
//       return { user: null};
//     default:
//       return state;
//   }
// };

// const InitialState = ()=>{
//   try {
//     const storedUser = localStorage.getItem('usertoken');
//    if(storedUser){
//     return{user:storedUser}
//    }
//   } catch (error) {
//     return{user:null}
//   }
// }

// // AuthContextProvider component
// export const AuthContextProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, InitialState());

//   useEffect(() => {
//       try {
//        localStorage.setItem("usertoken",state.user)
//       } catch (error) {
//         console.error('Failed to parse user from local storage:', error);
//       }
//   }, [])

//   return (
//     <AuthContext.Provider value={{ ...state, dispatch }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
import { createContext, useReducer, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN': {
      const token = action.payload.token;
      let showPopup = false;

      try {
        const decoded = jwtDecode(token);
        const role = decoded?.payLoad?.role;
        showPopup = role === 'User';
      } catch (e) {
        console.error('JWT decode failed on LOGIN:', e);
      }

      return {
        user: token,
        showApprovalPopup: showPopup,
      };
    }

    case 'LOGOUT':
      localStorage.removeItem('usertoken');
      localStorage.removeItem('userid');
      localStorage.removeItem('email');
      return {
        user: null,
        showApprovalPopup: false,
      };

    case 'HIDE_APPROVAL_POPUP':
      return {
        ...state,
        showApprovalPopup: false,
      };

    default:
      return state;
  }
};

const InitialState = () => {
  try {
    const storedUser = localStorage.getItem('usertoken');
    if (storedUser) {
      const decoded = jwtDecode(storedUser);
      const role = decoded?.payLoad?.role;
      return {
        user: storedUser,
        showApprovalPopup: role === 'User',
      };
    }
  } catch (error) {
    console.error('Failed to parse initial state:', error);
  }
  return { user: null, showApprovalPopup: false };
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, InitialState());

  useEffect(() => {
    try {
      if (state.user) {
        localStorage.setItem('usertoken', state.user);
      }
    } catch (error) {
      console.error('Failed to persist user token:', error);
    }
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
