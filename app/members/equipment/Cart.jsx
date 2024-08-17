'use client'

import { useBorrowingCart } from '@/app/api/user/equipment';
import { useRouter } from 'next/navigation';
import { sendCartData } from "@/app/api/user/equipment";
import { useState } from 'react';

const BorrowingCart = () => {
    const { cart, dispatch } = useBorrowingCart();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const removeFromCart = (product) => {
        dispatch({ type: 'REMOVE_ITEM', payload: product });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await sendCartData(cart);
            clearCart();
            router.push('/members/equipment');
        } catch (err) {
            setError('Failed to reserve items. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2>Reservations</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cart.map((item, index) => (
                        <li key={index}>
                            {item.type}
                            <button onClick={() => removeFromCart(item)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            {error && <p className="error">{error}</p>}
            {cart.length > 0 &&
                <form className="checkout_form_buttons" onSubmit={handleSubmit}>
                    <button type="button" onClick={clearCart} disabled={isSubmitting}>Clear Cart</button>
                    <button type="submit" disabled={isSubmitting}>Reserve</button>
                </form>
            }
        </div>
    );
};

export default BorrowingCart;
