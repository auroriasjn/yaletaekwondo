import createCartContext from './shop.js';

const { CartProvider: BorrowingCartProvider, useCart: useBorrowingCart } = createCartContext();
export { BorrowingCartProvider, useBorrowingCart };

export const sendCartData = async (cart) => {
    try {
        const emailDispatch = await fetch('http://localhost:3002/api/equipment/email', {
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

        const response = await fetch('http://localhost:3002/api/equipment/reserve', {
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