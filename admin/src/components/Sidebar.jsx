import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'

const Sidebar = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  return (
    <div className='min-h-screen bg-white border-r'>
      {aToken && (
        <ul className='text-[#515151] mt-5'>
          <NavLink
            to={'/admin-dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-4 py-3 px-4 md:px-8 md:min-w-72 cursor-pointer rounded-lg transition-colors duration-200 ease-in-out ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary text-primary' : 'hover:bg-[#F2F3FF]'}`
            }
          >
            <img className='w-6 h-6' src={assets.home_icon} alt='' />
            <p className='hidden md:block text-lg font-medium'>Dashboard</p>
          </NavLink>
          <NavLink
            to={'/all-appointments'}
            className={({ isActive }) =>
              `flex items-center gap-4 py-3 px-4 md:px-8 md:min-w-72 cursor-pointer rounded-lg transition-colors duration-200 ease-in-out ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary text-primary' : 'hover:bg-[#F2F3FF]'}`
            }
          >
            <img className='w-6 h-6' src={assets.appointment_icon} alt='' />
            <p className='hidden md:block text-lg font-medium'>Appointments</p>
          </NavLink>
          <NavLink
            to={'/add-doctor'}
            className={({ isActive }) =>
              `flex items-center gap-4 py-3 px-4 md:px-8 md:min-w-72 cursor-pointer rounded-lg transition-colors duration-200 ease-in-out ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary text-primary' : 'hover:bg-[#F2F3FF]'}`
            }
          >
            <img className='w-6 h-6' src={assets.add_icon} alt='' />
            <p className='hidden md:block text-lg font-medium'>Add Doctor</p>
          </NavLink>
          <NavLink
            to={'/doctor-list'}
            className={({ isActive }) =>
              `flex items-center gap-4 py-3 px-4 md:px-8 md:min-w-72 cursor-pointer rounded-lg transition-colors duration-200 ease-in-out ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary text-primary' : 'hover:bg-[#F2F3FF]'}`
            }
          >
            <img className='w-6 h-6' src={assets.people_icon} alt='' />
            <p className='hidden md:block text-lg font-medium'>Doctors List</p>
          </NavLink>
        </ul>
      )}
  
      {dToken && (
        <ul className='text-[#515151] mt-5'>
          <NavLink
            to={'/doctor-dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-4 py-3 px-4 md:px-8 md:min-w-72 cursor-pointer rounded-lg transition-colors duration-200 ease-in-out ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary text-primary' : 'hover:bg-[#F2F3FF]'}`
            }
          >
            <img className='w-6 h-6' src={assets.home_icon} alt='' />
            <p className='hidden md:block text-lg font-medium'>Dashboard</p>
          </NavLink>
          <NavLink
            to={'/doctor-appointments'}
            className={({ isActive }) =>
              `flex items-center gap-4 py-3 px-4 md:px-8 md:min-w-72 cursor-pointer rounded-lg transition-colors duration-200 ease-in-out ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary text-primary' : 'hover:bg-[#F2F3FF]'}`
            }
          >
            <img className='w-6 h-6' src={assets.appointment_icon} alt='' />
            <p className='hidden md:block text-lg font-medium'>Appointments</p>
          </NavLink>
          <NavLink
            to={'/patients'}
            className={({ isActive }) =>
              `flex items-center gap-4 py-3 px-4 md:px-8 md:min-w-72 cursor-pointer rounded-lg transition-colors duration-200 ease-in-out ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary text-primary' : 'hover:bg-[#F2F3FF]'}`
            }
          >
            <img className='w-6 h-6' src={assets.people_icon} alt='' />
            <p className='hidden md:block text-lg font-medium'>Patients List</p>
          </NavLink>
          <NavLink
            to={'/doctor-profile'}
            className={({ isActive }) =>
              `flex items-center gap-4 py-3 px-4 md:px-8 md:min-w-72 cursor-pointer rounded-lg transition-colors duration-200 ease-in-out ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary text-primary' : 'hover:bg-[#F2F3FF]'}`
            }
          >
            <img className='w-6 h-6' src={assets.people_icon} alt='' />
            <p className='hidden md:block text-lg font-medium'>Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
  
}

export default Sidebar