import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]'>
      <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="" />
      <ul className='md:flex items-start gap-5 font-medium hidden'>
        <NavLink to='/' >
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors' >
          <li className='py-1'>BOOKING</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about' >
          <li className='py-1'>DASHBOARD</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-4 '>
        {
          token && userData
            ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-8 rounded-full' src={userData.image} alt="" />
              <img className='w-2.5' src={assets.dropdown_icon} alt="" />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                  <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                </div>
              </div>
            </div>
            : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create account</button>
        }
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

        {/* ---- Mobile Menu ---- */}
        <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img src={assets.logo} className='w-36' alt="" />
            <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded full inline-block'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors' ><p className='px-4 py-2 rounded full inline-block'>BOOKING</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about' ><p className='px-4 py-2 rounded full inline-block'>ABOUT</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  )

  // return (
  //   <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]'>
  //     <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="Logo" />
  
  //     <ul className='md:flex items-center gap-5 font-medium hidden'>
  //       <NavLink to='/' >
  //         <li className='py-1 px-2 rounded hover:bg-gray-100 transition-colors duration-200'>HOME</li>
  //         <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
  //       </NavLink>
  //       <NavLink to='/doctors' >
  //         <li className='py-1 px-2 rounded hover:bg-gray-100 transition-colors duration-200'>BOOKING</li>
  //         <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
  //       </NavLink>
  //       <NavLink to='/about' >
  //         <li className='py-1 px-2 rounded hover:bg-gray-100 transition-colors duration-200'>DASHBOARD</li>
  //         <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
  //       </NavLink>
  //     </ul>
  
  //     <div className='flex items-center gap-4'>
  //       {
  //         token && userData
  //           ? <div className='relative flex items-center gap-2 cursor-pointer group'>
  //             <img className='w-8 h-8 rounded-full' src={userData.image} alt="User" />
  //             <img className='w-4 h-4' src={assets.dropdown_icon} alt="Dropdown Icon" />
  //             <div className='absolute right-0 top-full mt-2 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
  //               <div className='min-w-48 bg-white shadow-lg rounded-lg flex flex-col gap-2 p-4'>
  //                 <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer transition-colors duration-200'>My Profile</p>
  //                 <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer transition-colors duration-200'>My Appointments</p>
  //                 <p onClick={logout} className='hover:text-black cursor-pointer transition-colors duration-200'>Logout</p>
  //               </div>
  //             </div>
  //           </div>
  //           : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create account</button>
  //       }
  //       <img onClick={() => setShowMenu(true)} className='w-6 h-6 md:hidden' src={assets.menu_icon} alt="Menu Icon" />
  
  //       {/* ---- Mobile Menu ---- */}
  //       <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all ease-in-out duration-300`}>
  //         <div className='flex items-center justify-between px-5 py-6 border-b border-gray-200'>
  //           <img src={assets.logo} className='w-36' alt="Logo" />
  //           <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="Close Icon" />
  //         </div>
  //         <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
  //           <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200'>HOME</p></NavLink>
  //           <NavLink onClick={() => setShowMenu(false)} to='/doctors' ><p className='px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200'>BOOKING</p></NavLink>
  //           <NavLink onClick={() => setShowMenu(false)} to='/about' ><p className='px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200'>ABOUT</p></NavLink>
  //         </ul>
  //       </div>
  //     </div>
  //   </div>
  // )
  
}

export default Navbar