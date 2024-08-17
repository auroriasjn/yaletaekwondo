'use client'

import { useBorrowingCart } from '@/app/api/user/equipment';
import { useState, useEffect } from 'react';

const AddToCartButton = ({ product }) => {
    const { cart, dispatch } = useBorrowingCart();
    const [reserved, setReserved] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const isProductInCart = (cart, product) => {
        return cart.some(cartItem => cartItem.id === product.id);
    };

    useEffect(() => {
        if (cart.length > 0 && isProductInCart(cart, product)) {
            setReserved(true);
        }
    }, [cart, product]);

    const addToBorrowingCart = async () => {
        setIsProcessing(true);

        try {
            await dispatch({ type: 'ADD_ITEM', payload: product });
            setReserved(true);
        } catch (err) {
            // Handle any errors that might occur
            console.error('Failed to add item to cart:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <button onClick={addToBorrowingCart} disabled={reserved || isProcessing}>
            {reserved ? 'Reserved' : isProcessing ? 'Processing...' : 'Reserve'}
        </button>
    );
};

export default AddToCartButton;
