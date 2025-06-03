import { createContext, useReducer } from 'react';

export const OrderContext = createContext();

const getInitialState = () => {
  try {
    const saved = localStorage.getItem('temp_order_data');
    return saved ? JSON.parse(saved) : {
      order: null,
      productName: '',
      sku: '',
      index: null,
      merchantId: '',
    };
  } catch {
    return {
      order: null,
      productName: '',
      sku: '',
      index: null,
      merchantId: '',
    };
  }
};

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ORDER':
      localStorage.setItem('temp_order_data', JSON.stringify(action.payload));
      return { ...state, ...action.payload };

    case 'CLEAR_ORDER':
      localStorage.removeItem('temp_order_data');
      return {
        order: null,
        productName: '',
        sku: '',
        index: null,
        merchantId: '',
      };

    default:
      return state;
  }
};

export const OrderContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, getInitialState());

  return (
    <OrderContext.Provider value={{ ...state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
};
