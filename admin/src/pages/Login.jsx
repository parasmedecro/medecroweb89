import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [number, setNumber] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Admin') {

      const { data } = await axios.post(backendUrl + '/api/admin/login', { number, password })
      if (data.success) {
        setAToken(data.token)
        localStorage.setItem('aToken', data.token)
      } else {
        toast.error(data.message)
      }

    } else {

      const { data } = await axios.post(backendUrl + '/api/doctor/login', { number, password })
      if (data.success) {
        setDToken(data.token)
        localStorage.setItem('dToken', data.token)
      } else {
        toast.error(data.message)
      }

    }

  }

  return (
<form onSubmit={onSubmitHandler} className='min-h-screen flex items-center justify-center p-4'>
  <div className='flex flex-col gap-5 p-8 min-w-[340px] sm:min-w-[400px] border rounded-xl shadow-lg bg-white'>
    <h1 className='text-3xl font-bold text-center mb-6'><span className='text-primary'>{state}</span> Login</h1>
    
    <div className='w-full'>
      <label htmlFor="phone" className='block text-gray-700 font-medium mb-1'>Phone Number</label>
      <input
        id="phone"
        type="tel"
        pattern='[0-9]{10}'
        required
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        className='border border-gray-300 rounded-lg w-full p-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary'
      />
    </div>
    
    <div className='w-full'>
      <label htmlFor="password" className='block text-gray-700 font-medium mb-1'>Password</label>
      <input
        id="password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='border border-gray-300 rounded-lg w-full p-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary'
      />
    </div>
    
    <button
      type="submit"
      className='bg-primary text-white w-full py-3 rounded-md text-lg font-semibold transition-colors hover:bg-primary-dark'
    >
      Login
    </button>
    
    <div className='text-center'>
      {
        state === 'Admin'
          ? <p>Doctor Login? <span onClick={() => setState('Doctor')} className='text-primary underline cursor-pointer'>Click here</span></p>
          : <p>Admin Login? <span onClick={() => setState('Admin')} className='text-primary underline cursor-pointer'>Click here</span></p>
      }
    </div>
  </div>
</form>

  )
}

export default Login