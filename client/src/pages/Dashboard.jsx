
//import React from 'react'
import { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashHotels from '../components/DashHotels';
import DashUsers from '../components/DashUsers';
import DashboardComp from '../components/DashboardComp';
import DashDestinations from '../components/DashDestinations';
import DashTours from '../components/DashTours';
import DashVehicles from '../components/VehicleComp/DashVehicles';
import DashBookings from '../components/DashBookings';
import DashSubscribers from '../components/DashSubscribers';
import DashCreateVehicle from '../components/VehicleComp/DashCreateVehicle';


function Dashboard() {

const location = useLocation();
// eslint-disable-next-line no-unused-vars
const [tab,setTab]=useState('');
useEffect(()=>{
const urlParams = new URLSearchParams(location.search);
const tabFromUrl = urlParams.get('tab');
//console.log(tabFromUrl);
if(tabFromUrl)
  {
    setTab(tabFromUrl);
  }

}, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
       <div className='lg:ml-32 md:w-56'>
        {/*Sidebar*/}
        <DashSidebar/>
       </div>
      {/*Profile*/}
      {tab==='profile' && <DashProfile/>}
      {/*Posts*/}
      {tab==='hotels' && <DashHotels/>}
      {/*Posts*/}
      {tab==='users' && <DashUsers/>}
     
      {/*Dashboard*/}
      {tab==='dash' && <DashboardComp/>}
      {/*Destinations*/}
      {tab==='destinations' && <DashDestinations/>}
      {/*Tours*/}
      
      {tab==='tours' && <DashTours/>}
        {/*Vehicless*/}
        {tab==='vehicles' && <DashVehicles/>}
        {tab==='createvehicle' && <DashCreateVehicle/>}
      {/*Bookings*/}
      {tab==='bookings' && <DashBookings/>}
      {/*Subscribers*/}
      {tab==='subscribers' && <DashSubscribers/>}


    </div>
  )
}

export default Dashboard;
