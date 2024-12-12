import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../Features/AuthSlice'
import authService, { AuthService } from '../appwrite/auth'

function LogoutBtn() {
    const dispatch = useDispatch();
    const LogoutHandler = ()=>{
            AuthService.logout()
            .then(()=>{
                dispatch(logout())
            })
    }
  return (
    <button
    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
    onClick={LogoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn
