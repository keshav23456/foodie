import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function Intent({subtotal}) {
    const cartItems = useSelector(state => state.cartReducer.cartItems);
    const currentUser = useSelector(state => state.loginUserReducer.currentUser);

    const handleClick = () => {
        if (!currentUser) {
            alert('Please login to proceed with payment');
            window.location.href = '/login';
            return;
        }
        axios.post('/api/orders/checkout_session', {cartItems, userid: currentUser._id})
            .then(res => {
                const sessionURL = res.data.url;
                window.location.replace(sessionURL);
            })
            .catch(err => console.log(err));
    }

    return <>
        <button className='btn btn-sm float-end' onClick={handleClick}>
            {currentUser ? 'Pay Now' : 'Login to Pay'}
        </button>
    </>
}