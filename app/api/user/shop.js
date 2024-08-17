import { createContext, useContext, useReducer } from 'react';

const createCartContext = () => {
    const CartContext = createContext();

    const cartReducer = (state, action) => {
        switch (action.type) {
            case 'ADD_ITEM':
                return [...state, action.payload];
            case 'REMOVE_ITEM':
                return state.filter(item => item.id !== action.payload.id);
            case 'CLEAR_CART':
                return [];
            default:
                return state;
        }
    };

    const CartProvider = ({ children }) => {
        const [cart, dispatch] = useReducer(cartReducer, []);

        return (
            <CartContext.Provider value={{ cart, dispatch }}>
                {children}
            </CartContext.Provider>
        );
    };

    const useCart = () => useContext(CartContext);

    return { CartProvider, useCart };
};

export const sendCartData = async (cart) => {
    try {
        const emailDispatch = await fetch('http://localhost:3002/api/shop/email', {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cart),
            credentials: 'include'
        });

        if (!emailDispatch.ok) {
            throw new Error('Network response was not ok.');
        }

        const response = await fetch('http://localhost:3002/api/shop/purchase', {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cart),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

const { CartProvider: PurchasingCartProvider, useCart: usePurchasingCart } = createCartContext();
export { PurchasingCartProvider, usePurchasingCart };

export default createCartContext;