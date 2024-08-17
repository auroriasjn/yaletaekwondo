'use client';

import { usePurchasingCart } from '@/app/api/user/shop';
import { useState, useEffect } from 'react';

const AddToCartButton = ({ product }) => {
    const { cart, dispatch } = usePurchasingCart();
    const [added, setAdded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    console.log(cart);
    console.log(product);

    useEffect(() => {
        if (cart.length > 0) {
            const isInCart = cart.some(cartItem => cartItem.id === product.id && cartItem.size === product.size);
            setAdded(isInCart);
        }
    }, [cart, product]);

    const addToPurchasingCart = async () => {
        setIsProcessing(true);

        try {
            await dispatch({ type: 'ADD_ITEM', payload: product });
            setAdded(true);
        } catch (err) {
            console.error('Failed to add item to cart:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <button onClick={addToPurchasingCart} disabled={added || isProcessing}>
            {added ? 'Added' : isProcessing ? 'Processing...' : 'Add to Bag'}
        </button>
    );
};

export default AddToCartButton;
