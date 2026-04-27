import axios from "axios"
export const placeorder=(token ,subtotal)=>async(dispatch, getState)=>{
    dispatch({type:'PLACE_ORDER_REQUEST'})
  const currentUser = getState().loginUserReducer.currentUser
  const cartItems = getState().cartReducer.cartItems
    try{

      console.log(token)
        const response = await axios.post('/api/orders/placeorder', {token ,subtotal,currentUser,cartItems})
        dispatch({type:'PlACE_ORDER_SUCCESS'})
        console.log(response)
    }catch(error){
        dispatch({type:'PlACE_ORDER_FAILED'})
      console.log(error);
    }
}

export const getUserOrders=()=>async (dispatch,getState)=>{
    
  const currentUser = getState().loginUserReducer.currentUser
  dispatch({type:"GET_USER_ORDER_REQUEST"})

  try{
  const response = await axios.post('/api/orders/getuserorders',{userid : currentUser._id}) 
  dispatch({type:"GET_USER_ORDER_SUCCESS" , payload:response.data})
  } catch(error){
    console.log(error)
      dispatch({type:"GET_USER_ORDER_FAILED" , payload:error})
  }
}