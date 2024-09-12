import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {

  const { speciality } = useParams()

  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div>
      {/* <p className='text-gray-600'>Browse through the doctors specialist.</p> */}
      {/* Above code is for filtering the doctors */}

      <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
  {filterDoc.map((item, index) => (
    <div
      onClick={() => {
        navigate(`/appointment/${item._id}`);
        scrollTo(0, 0);
      }}
      className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
      key={index}
    >
      <div className="relative">
        {/* Fix the height of the image and ensure it fills the card without distortion */}
        <img className='bg-[#EAEFFF] w-full h-64 object-cover' src={item.image} alt={item.name} />
        <div className='absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md text-white p-4'>
          <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
            <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p>
            <p>{item.available ? 'Available' : "Not Available"}</p>
          </div>
          <p className='text-lg font-medium'>{item.name}</p>
          <p className='text-sm'>{item.speciality}</p>
        </div>
      </div>
    </div>
  ))}
</div>


    </div>
  )
}

export default Doctors