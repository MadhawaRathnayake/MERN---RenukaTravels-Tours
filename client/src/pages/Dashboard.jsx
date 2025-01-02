import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashHotels from '../components/DashHotels';
import DashUsers from '../components/DashUsers';
import DashboardComp from '../components/DashboardComp';
import DashDestinations from '../components/DashDestinations';
import DashTours from '../components/featuredTours/DashTours';
import DashCreateTours from '../components/featuredTours/DashCreateTour';
import DashVehicles from '../components/VehicleComp/DashVehicles';
import DashBookings from '../components/DashBookings';
import DashSubscribers from '../components/DashSubscribers';
import DashCreateVehicle from '../components/VehicleComp/DashCreateVehicle';
import DashGallery from '../components/DashGallery';  // Added import for DashGallery

function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-row lg:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      
      {/* Conditional rendering based on the selected tab */}
      {tab === "profile" && <DashProfile />}
      {tab === "hotels" && <DashHotels />}
      {tab === "users" && <DashUsers />}
      {tab === "dash" && <DashboardComp />}
      {tab === "destinations" && <DashDestinations />}
      {/*Tours*/}
      {tab==='tours' && <DashTours/>}
      {tab==='createtour' && <DashCreateTours/>}
      
        {/*Vehicless*/}
        {tab==='vehicles' && <DashVehicles/>}
        {tab==='createvehicle' && <DashCreateVehicle/>}
      
      
      {/*Bookings*/}
      {tab === "bookings" && <DashBookings />}
      {tab === "subscribers" && <DashSubscribers />}
      
      {/* Gallery Tab */}
      {tab === "gallery" && <DashGallery />}  {/* Render DashGallery when 'gallery' tab is selected */}
    </div>
  );
}

export default Dashboard;
