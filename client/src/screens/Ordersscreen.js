
import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../components/Loading'
import Success from '../components/Success'
import Error  from '../components/Error'
import { getUserOrders } from '../actions/orderActions'
export default function Ordersscreen() {
    
    const orderstate = useSelector((state)=>state.getUserOrderReducer)
    const {loading, orders}=orderstate
    console.log(orders)
//    const {loading,error,success}=orderstate

   const dispatch = useDispatch()
   useEffect(() => {
    dispatch(getUserOrders())
  }, [])
  return (
<>
<h2 style={{fontSize:'35px',textAlign:'center'}}>My Orders</h2>
<hr/>
<div className='row justify-content-center'>
{loading && (<Loading/>)}
{/* {error && (<Error error='something went wrong'/>)} */}
{orders && orders.map(order=>{
    return <div className='col-md-8' style={{backgroundColor:'red',color:'white'}}>
         
        <div className='flex-container'>
        <div className='text-left w-100 m-1'>
          <h2 style={{fontSize:"25px"}}>Items</h2>
          <hr/>
         {order.orderItems.map(item=>{
            return <div>
                <h1>{item.name} [{item.varient}]*{item.quantity}={item.price}</h1>

            </div>
         })}
        </div>
        
        <div className='text-left w-100 m-1'> 
        <h2 style={{fontSize:"25px"}}>Order Info</h2>
        <hr/>
            <h1>Order Amount: {order.orderAmount}</h1>
            <h1>Date: {order.createdAt.substring(0,10)}</h1>
            <h1>Transaction Id: {order.transactionId}</h1>
            <h1>Order Id: {order._id}</h1>
        </div>
        </div>
    </div>
})}
</div>
</>
  )
}
