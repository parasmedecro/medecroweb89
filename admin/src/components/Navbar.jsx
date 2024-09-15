import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext);
  const { aToken, setAToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate('/');
    if (dToken) {
      setDToken('');
      localStorage.removeItem('dToken');
    }
    if (aToken) {
      setAToken('');
      localStorage.removeItem('aToken');
    }
  };

  return (
    <nav className='flex justify-between items-center px-4 sm:px-8 py-3 border-b bg-white shadow-md'>
      <div className='flex items-center gap-3'>
        <img
          onClick={() => navigate('/')}
          className='w-32 sm:w-36 md:w-40 cursor-pointer'
          src={assets.admin_logo}
          alt='Logo'
        />
        <p className='border px-3 py-1 rounded-full border-gray-500 text-gray-600 text-sm font-medium'>
          {aToken ? 'Admin' : 'Doctor'}
        </p>
      </div>
      <button
        onClick={logout}
        className='bg-primary text-white text-sm px-6 py-2 rounded-full hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark transition-colors'
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
