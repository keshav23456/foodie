import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPizzas } from '../actions/pizzaActions'
// import { getAllPizzaReducer } from '../reducers/pizzaReducers'
import Pizza from '../components/Pizza'
import Loading from '../components/Loading'
import Error from '../components/Error'
export default function Homescreen() {

  const dispatch = useDispatch()

  const pizzasstate = useSelector((state) => state.getAllPizzaReducer)

  const { pizzas, error, loading } = pizzasstate

  useEffect(() => {
    dispatch(getAllPizzas())
  }, [])
  console.log(loading)
  console.log(error)
  return (
      <div className="row mx-0 justify-content-center">

        {loading ? <Loading/> : error ? <Error error='Something went wrong'/> : (
          pizzas.map(pizza => {
            return <div className="col-10 col-sm-6 col-md-4 col-lg-3 m-3" key={pizza._id}>
          
                <Pizza pizza={pizza} />
           
            </div>
          })

        )}
      </div>

  )
}
