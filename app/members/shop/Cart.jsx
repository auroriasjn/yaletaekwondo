'use client'

import { usePurchasingCart } from '@/app/api/user/shop';
import { useRouter } from 'next/navigation';
import { sendCartData } from "@/app/api/user/shop";
import { useState } from 'react';

const PurchasingCart = () => {
    const { cart, dispatch } = usePurchasingCart();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const totalPrice = (items) => {
        return items.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2);
    }

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
            router.push('/members/shop');
        } catch (err) {
            setError('Failed to add items to cart. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2>Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cart.map((item, index) => (
                        <li key={index}>
                            <b>{item.quantity}</b> {item.type}, Size {item.size}: {item.price.toFixed(2)}
                            <button onClick={() => removeFromCart(item)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            {error && <p className="error">{error}</p>}
            {cart.length > 0 &&
                <>
                    <h2>Your Total: ${totalPrice(cart)}</h2>
                    <form className="checkout_form_buttons" onSubmit={handleSubmit}>
                        <button type="button" onClick={clearCart} disabled={isSubmitting}>Clear Cart</button>
                        <button type="submit" disabled={isSubmitting}>Checkout</button>
                    </form>
                </>
            }
        </div>
    );
};

export default PurchasingCart;
