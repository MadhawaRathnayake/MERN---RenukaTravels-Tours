//import React from 'react'
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashHotels from "../components/DashHotels";
import DashUsers from "../components/DashUsers";
import DashboardComp from "../components/DashboardComp";
import DashDestinations from "../components/DashDestinations";
import DashTours from "../components/DashTours";
import DashVehicles from "../components/DashVehicles";
import DashBookings from "../components/DashBookings";
import DashSubscribers from "../components/DashSubscribers";

function Dashboard() {
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    //console.log(tabFromUrl);
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-row lg:flex-row">
      <div className="md:w-56">
        {/*Sidebar*/}
        <DashSidebar />
      </div>
      {/*Profile*/}
      {tab === "profile" && <DashProfile />}
      {/*Posts*/}
      {tab === "hotels" && <DashHotels />}
      {/*Posts*/}
      {tab === "users" && <DashUsers />}

      {/*Dashboard*/}
      {tab === "dash" && <DashboardComp />}
      {/*Destinations*/}
      {tab === "destinations" && <DashDestinations />}
      {/*Tours*/}

      {tab === "tours" && <DashTours />}
      {/*Vehicless*/}
      {tab === "vehicles" && <DashVehicles />}
      {/*Bookings*/}
      {tab === "bookings" && <DashBookings />}
      {/*Subscribers*/}
      {tab === "subscribers" && <DashSubscribers />}
    </div>
  );
}

export default Dashboard;
