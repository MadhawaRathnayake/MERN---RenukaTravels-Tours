/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../utils/config';
import { 
  CalendarIcon, 
  UserIcon, 
  PhoneIcon, 
  MailIcon, 
  CreditCardIcon,
  ShieldCheckIcon,
  TicketIcon
} from '@heroicons/react/outline';

const Booking = ({ tour }) => {
  const { price, title, images } = tour;
  const navigate = useNavigate();
  
  // Get user from Redux store
  const { currentUser } = useSelector((state) => state.user);
  
  // Get today's date for min date attribute
  const today = new Date().toISOString().split('T')[0];

  const [booking, setBooking] = useState({
    userId: currentUser?._id,
    userEmail: currentUser?.email,
    tourName: title,
    fullName: currentUser?.username || "",
    phone: "",
    guestSize: 1,
    bookAt: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    setBooking(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const serviceFee = 10;
  const totalAmount = Number(price) * Number(booking.guestSize) + Number(serviceFee);

  // send data to server
  const handleClick = async e => {
    e.preventDefault();
    
    if (!currentUser) {
      return alert('Please sign in');
    }
    
    setIsSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/booking`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        credentials: 'include',
        body: JSON.stringify(booking)
      });

      const result = await res.json();
      if (!res.ok) {
        setIsSubmitting(false);
        return alert(result.message);
      }
      
      // If booking successful, navigate to thank you page
      navigate('/thank-you');
    } catch (err) {
      setIsSubmitting(false);
      alert(err.message);
    }
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-20 border border-gray-100 transform transition-all hover:shadow-2xl">
      {/* Header with price */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-6 py-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-2 backdrop-blur-sm">
            Limited Spots Available
          </span>
          <h3 className="text-3xl font-bold flex items-baseline">
            ${price} <span className="text-base font-normal opacity-90 ml-1">per person</span>
          </h3>
          <p className="text-white/90 text-sm mt-1 font-medium">Secure your adventure with instant booking</p>
        </div>
        <div className="absolute -right-12 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -left-12 -top-16 w-36 h-36 bg-indigo-300/20 rounded-full blur-xl"></div>
      </div>

      {/* Booking form */}
      <div className="p-6">
        <h4 className="text-gray-800 font-semibold text-lg mb-5 flex items-center">
          <TicketIcon className="h-5 w-5 mr-2 text-indigo-500" />
          <span>Complete Your Booking</span>
        </h4>
        
        <form className="space-y-4" onSubmit={handleClick}>
          {/* Full Name */}
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Full Name" 
              id="fullName" 
              required 
              onChange={handleChange}
              defaultValue={currentUser?.username || ''}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition pl-11 group-hover:border-indigo-300"
            />
            <UserIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
          </div>
          
          {/* Email */}
          <div className="relative">
            <input 
              type="email" 
              placeholder="Email" 
              id="userEmail" 
              required 
              value={currentUser?.email || ''}
              readOnly
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 pl-11"
            />
            <MailIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          
          {/* Phone */}
          <div className="relative group">
            <input 
              type="tel" 
              placeholder="Phone Number" 
              id="phone" 
              required 
              onChange={handleChange} 
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition pl-11 group-hover:border-indigo-300"
            />
            <PhoneIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
          </div>
          
          {/* Date and Guests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group">
              <input 
                type="date" 
                id="bookAt" 
                required 
                min={today}
                onChange={handleChange} 
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition pl-11 group-hover:border-indigo-300"
              />
              <CalendarIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            
            <div className="relative group">
              <select
                id="guestSize"
                required
                onChange={handleChange}
                value={booking.guestSize}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition pl-11 appearance-none group-hover:border-indigo-300"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
              <UserIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </form>

        {/* Price Breakdown */}
        <div className="mt-6 rounded-xl bg-gradient-to-b from-gray-50 to-white p-5 border border-gray-100">
          <h4 className="font-medium text-gray-700 mb-4">Price Details</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">${price} × {booking.guestSize} {booking.guestSize > 1 ? 'guests' : 'guest'}</span>
              <span className="font-medium">${price * booking.guestSize}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Service fee</span>
              <span className="font-medium">${serviceFee}</span>
            </div>
            
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-3"></div>
            
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-indigo-600">${totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Book Now Button */}
        <button 
          className={`w-full mt-6 py-4 rounded-xl font-semibold text-white transition-all relative overflow-hidden ${
            currentUser && !isSubmitting
              ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200/50' 
              : isSubmitting 
                ? 'bg-indigo-500 cursor-wait'
                : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={handleClick}
          disabled={!currentUser || isSubmitting}
        >
          <span className="relative z-10">
            {!currentUser 
              ? 'Please sign in to book' 
              : isSubmitting 
                ? 'Processing...' 
                : 'Book Now'}
          </span>
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
        
        {/* Additional info */}
        <div className="mt-5 flex items-center justify-center text-xs text-gray-500 gap-1">
          <ShieldCheckIcon className="h-4 w-4 text-green-500" />
          <p>Secure booking • No charges until confirmation • Free cancellation 48h before</p>
        </div>
      </div>
    </div>
  );
};

export default Booking;