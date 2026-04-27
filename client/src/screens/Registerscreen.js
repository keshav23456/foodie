import React, { useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { registerUser } from '../actions/userAction'
import Loading from '../components/Loading'
import Success from '../components/Success'
import Error  from '../components/Error'
export default function Registerscreen() {
    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const[cpassword,setcpassword]=useState('')
    const registerstate = useSelector(state =>state.registerUserReducer)
    const {error, loading ,success}= registerstate
    const dispatch= useDispatch()
    function register(){
        if(password!=cpassword)
        {
            alert("passwords not matched")
        }
        else{
            const user={
                name,
                email,
                password
        }
        console.log(user);
        dispatch(registerUser(user))
        }
    }

    return (
        <>
            <div className='row justify-content-center mt-5'>
                <div className='col-md-5 mt-5 text-left shadow-lg p-3 mb-5 bg-white rounded'>

                 {loading && (<Loading/>)}
                  {success && (<Success success='User register successfully'/>)}
                      {error && (<Error error='Email already register'/>)}           

                    <h2 className='text-center' style={{ fontSize: '35px' }}>Register</h2>
                    <div>
                        <input required type='text' placeholder='name' className='form-control' value={name} onChange={(e)=>{setname(e.target.value)}} />
                        <input required type='text' placeholder='email' className='form-control'  value={email} onChange={(e)=>{setemail(e.target.value)}} />
                        <input required type='text' placeholder='password' className='form-control' value={password} onChange={(e)=>{setpassword(e.target.value)}}/>
                        <input required type='text' placeholder='confirm password' className='form-control' value={cpassword} onChange={(e)=>{setcpassword(e.target.value)}}/>
                        <button className='btn mt-3'onClick={register}>REGISTER</button>
                        <div className='col-12 mt-2'>
                        <a style={{color:'black', marginTop:"30px"}} href="/login">Click here to login</a>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}
