import React from 'react'
import { useSelector ,useDispatch} from 'react-redux'
import { addToCart } from '../actions/cartActions'
import { deleteFromCart } from '../actions/cartActions'
import Checkout from '../components/Checkout'
import Intent from '../components/Intent';
export default function Cartscreen() {
  const cartstate=useSelector(state=>state.cartReducer)
  const cartItems = cartstate.cartItems 
  var subtotal =cartItems.reduce((x,item)=>x+item.price,0)
  const dispatch = useDispatch()
    return (
    <>
     <div className='row justify-content-center'>
        <div className='col-md-6'>
            <h1 style={{fontSize:"40px",textAlign:'center'}}>My Cart</h1>
         {cartItems.map(item=>{
            return <div className='flex-container'>
            <div className='m-1 w-100'>
             <h1>{item.name} [{item.varient}]</h1>
             <h1>Price : {item.quantity} * {item.prices[0][item.varient]}={item.price}</h1>
             <h1 style={{display:'inline'}}>Quantity :</h1>
             <i className="fa fa-plus" aria-hidden="true" onClick={()=>dispatch(addToCart(item,item.quantity+1,item.varient))}></i>
             <b>{item.quantity}</b>
             <i className="fa fa-minus" aria-hidden="true"onClick={()=>dispatch(addToCart(item,item.quantity-1,item.varient))}></i>
             <hr/>
           </div>
        <div className='w-100 text-center'>  
            <img src={item.image} style={{height:'80px',width:'80px'}}/>

            <hr/>
           </div>

           <div>
           <i className="fa fa-trash mt-4" aria-hidden="true" onClick={()=>dispatch(deleteFromCart(item))}></i>
           
           </div>

          </div>
})}
     
        </div>

        <div className='col-md-5 justify-content-end'>
           <h2 style={{fontSize:"45px",textAlign:'center'}}>SubTotal : {subtotal} /Rs-</h2>   
           {/* <Checkout subtotal={subtotal}/> */}
           <Intent subtotal={subtotal}/>
           
        </div>
     </div>
    </>
  )
}
