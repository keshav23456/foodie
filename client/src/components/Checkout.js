import React from 'react'
import { useDispatch } from 'react-redux';
import { placeorder } from '../actions/orderActions';
import StripeCheckout from 'react-stripe-checkout'
export default function Checkout({subtotal}) {
 
  const dispatch=useDispatch()
 function tokenHander(token){
 console.log(token);
dispatch(placeorder(token,subtotal))
 }
    return (
    <>
      <StripeCheckout
      amount={subtotal*100}
      shippingAddress
      token={tokenHander}
      stripeKey='pk_test_51Mz1BCSG8p0UQul1nVqW9yZbeU6rOj7sqi84mNyw7oxzNRZGFWzIq7ZkJ9X4bapbiX2L2EdhEWzM4o7Cg2hE8Rus00nSKncARt'
      currency='INR'
      >
        <button className='btn btn-sm float-end'>Pay Now</button>
      </StripeCheckout>
    </>
  )
}
