import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function OrderSuccess() {
    // this component is loaded by stripe after a successful payment
    // this component sends an api request to server to check if the payment was successful
    // if successful it displays a success message, if not it displays an error message
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    useEffect(() => {
        const url = new URL(window.location.href);
        const order_id = url.searchParams.get('order_id');
        console.log(order_id)
        // send api request to server to check if payment was successful
        axios.post('/api/orders/verify-payment', { order_id })
            .then(res => {
                // if successful display success message
                if (res.data.success) {
                    // display success message
                    setSuccess(true);
                }
                // if not successful display error message
                else {
                    // display error message
                    setError(true);
                }
            })
            .catch(err => {
                // display error message
                setError(true);
            });
        }, []);
    if (success) {
        return (
            <div>
                <h1>Payment Successful</h1>
            </div>
        );
    }
    else if (error) {
        return (
            <div>
                <h1>Payment Failed</h1>
            </div>
        );
    }
    else {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }
};