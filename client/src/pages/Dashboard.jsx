import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashHotels from "../components/DashHotels";
import DashUsers from "../components/DashUsers";
import DashboardComp from "../components/DashboardComp";
import DashDestinations from "../components/DashDestinations";
import DashTours from "../components/featuredTours/DashTours";
import DashCreateTours from "../components/featuredTours/DashCreateTour";
import DashVehicles from "../components/VehicleComp/DashVehicles";
import DashBookings from "../components/DashBookings";
import DashCreateVehicle from "../components/VehicleComp/DashCreateVehicle";
import DashGallery from "../components/DashGallery";
import DashReviews from "../components/DashReviews";
import DashMyTravelPlan from "../components/DashTravelPlan";

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [isMobile, setIsMobile] = useState(false);

  // Tabs that should be restricted to admin users
  const adminTabs = [
    "users",
    "gallery",
    "reviews",
    "hotels",
    "tours",
    "destinations",
    "createtour",
    "createvehicle",
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
      // Check if non-admin is trying to access admin-only tab
      if (adminTabs.includes(tabFromUrl) && !currentUser?.isAdmin) {
        navigate("/dashboard?tab=dash", { replace: true }); // redirect to a safe tab
      } else {
        setTab(tabFromUrl);
      }
    } else {
      setTab("dash"); // default fallback
    }
  }, [location.search, currentUser, navigate]);

  const renderContent = () => {
    switch (tab) {
      case "profile":
        return <DashProfile />;
      case "hotels":
        return <DashHotels />;
      case "users":
        return <DashUsers />;
      case "dash":
        return <DashboardComp />;
      case "destinations":
        return <DashDestinations />;
      case "tours":
        return <DashTours />;
      case "vehicles":
        return <DashVehicles />;
      case "createvehicle":
        return <DashCreateVehicle />;
      case "bookings":
        return <DashBookings />;
      case "gallery":
        return <DashGallery />;
      case "reviews":
        return <DashReviews />;
      case "travel-plans":
        return <DashMyTravelPlan />;
      default:
        return <DashboardComp />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 mb-8 sm:px-6 lg:px-8">
      {/* Mobile Layout */}
      {isMobile ? (
        <div className="flex flex-col w-full">
          <div className="w-full mb-4">
            <DashSidebar />
          </div>
          <div className="w-full">{renderContent()}</div>
        </div>
      ) : (
        // Desktop Layout
        <div className="flex flex-row py-8 shadow-xl">
          <div className="w-56">
            <DashSidebar />
          </div>
          <div className="flex-1 min-h-[50vh] pl-4">{renderContent()}</div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
