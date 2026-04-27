const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const Order= require('../models/orderModels');
const Pizzas = require('../models/pizzaModel');

router.post('/verify-payment', async (req, res) => {
  // verify the payment using stripe checkout id
  const { order_id } = req.body;
  // get session id from order_id
  const order = await Order.findOne({ _id: order_id });
  const session_id = order.transactionId;
  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (session.payment_status === 'paid') {
    // update the order status to paid
    await Order.updateOne({ _id: order_id }, { $set: { isPaid: true } });
    res.json({ message: 'Payment successful', success: true });
  }
  else {
    res.json({ message: 'Payment failed', success: false });
  }
});
router.post('/checkout_session', async (req, res) => {
  // calculate the total price of the order from cart items, refer to prices in Pizza model
  // get details of each pizza in cartItems from Pizza model
  const pizzas = await Pizzas.find({ _id: req.body.cartItems.map(item => item._id) })
  console.log(pizzas)
  const total = req.body.cartItems.reduce((acc, item) => {
    const pizza = pizzas.find(pizza => pizza._id.toString() === item._id.toString())
    const varient = item.varient
    return acc + pizza.prices[0][varient] * item.quantity;
  }, 0);
  console.log(total)
  const newOrder = new Order({
    userid: req.body.userid,
    orderItems: req.body.cartItems,
    shippingAddress: req.body.shippingAddress,
    orderAmount: total,
    isDelivered: false,
  });
  order_id = newOrder._id;
  // create a new checkout session
  const session = await stripe.checkout.sessions.create({
    success_url: 'http://localhost:3000/success/?order_id='+order_id,
    cancel_url: 'http://localhost:3000/cancel',
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'pizza order', 
          },
          unit_amount: total*100,
          tax_behavior: 'exclusive',
        },
        quantity: 1,
      }
    ],
    mode: 'payment',
});
  const transactionId = session.id;
  newOrder.transactionId = transactionId;
  newOrder.save();
  res.json({ id: session.id, url: session.url });
});

router.post("/placeorder",async(req,res)=>{

    const {token , subtotal ,currentUser ,cartItems}= req.body
    console.log(token)
    try{
  const customer =await stripe.customers.create({
    email:token.email,
    source:token.id
  })
  const payment= await stripe.charges.create({
    amount:subtotal*100,
    currency:'inr',
    customer:customer.id,
    receipt_email:token.email
  },{
   idempotencyKey : uuidv4()    
  })
  if(payment)
  {
    const neworder= new Order({
     name:currentUser.name,
     email:currentUser.email,
     userid:currentUser._id,
     orderItems: cartItems,
     orderAmount: subtotal,
     shippingAddress:{
      street : token.card.address_line1,
      city: token.card.address_city,
      country:token.card.address_country,
      pincode:token.card.address_zip
     },
     transactionId:payment.source.id
    })
    neworder.save();
    res.send("Order Placed Successfully")
  }
  else{
    res.send("Payment Failed")
  }
    }
    catch(error){
      console.log(error)
     return res.status(400).json({message:"Something Went Wrong" + error});
    }

});

router.post("/getuserorders",async (req,res)=>{
const {userid}= req.body
try{
const orders = await Order.find({userid : userid })
res.send(orders)
}catch(error){
return res.status(400).json({message : 'Something went wrong'});
}
});
module.exports=router