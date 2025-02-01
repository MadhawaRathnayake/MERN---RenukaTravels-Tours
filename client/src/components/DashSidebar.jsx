import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import {
  FaHotel,
  FaMapMarkerAlt,
  FaPlaneDeparture,
  FaImages,
} from "react-icons/fa"; // Added FaImages for Gallery
import { MdDirectionsCar, MdAssignment } from "react-icons/md";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser.isAdmin && (
            <Sidebar.Item
              as={Link}
              to="/dashboard?tab=dash"
              active={tab === "dash" || !tab}
              icon={() => <HiChartPie className="text-orange-400" />}
            >
              Dashboard
            </Sidebar.Item>
          )}

          <Sidebar.Item
            as={Link}
            to="/dashboard?tab=profile"
            active={tab === "profile"}
            icon={() => <HiUser className="text-orange-400" />}
            label={currentUser.isAdmin ? "Admin" : "User"}
          >
            Profile
          </Sidebar.Item>

          {currentUser.isAdmin && (
            <Sidebar.Item
              as={Link}
              to="/dashboard?tab=hotels"
              active={tab === "hotels"}
              icon={() => <FaHotel className="text-orange-400" />}
            >
              Hotels
            </Sidebar.Item>
          )}

          {currentUser.isAdmin && (
            <Sidebar.Item
              as={Link}
              to="/dashboard?tab=destinations"
              active={tab === "destinations"}
              icon={() => <FaMapMarkerAlt className="text-orange-400" />}
            >
              Destinations
            </Sidebar.Item>
          )}

          {currentUser.isAdmin && (
            <Sidebar.Item
              as={Link}
              to="/dashboard?tab=tours"
              active={tab === "tours"}
              icon={() => <FaPlaneDeparture className="text-orange-400" />}
            >
              Tours
            </Sidebar.Item>
          )}

          {currentUser.isAdmin && (
            <Sidebar.Item
              as={Link}
              to="/dashboard?tab=gallery"
              active={tab === "gallery"}
              icon={() => <FaImages className="text-orange-400" />}
            >
              Gallery
            </Sidebar.Item>
          )}

          {!currentUser.isAdmin && (
            <Sidebar.Item
              as={Link}
              to="/dashboard?tab=travel-plans"
              active={tab === "travel-plans"}
              icon={() => <FaMapMarkerAlt className="text-orange-400" />}
            >
              My Travel Plans
            </Sidebar.Item>
          )}

          {currentUser.isAdmin && (
            <Sidebar.Item
              as={Link}
              to="/dashboard?tab=vehicles"
              active={tab === "vehicles"}
              icon={() => <MdDirectionsCar className="text-orange-400" />}
            >
              Vehicles
            </Sidebar.Item>
          )}

          {currentUser.isAdmin && (
            <Sidebar.Item
              as={Link}
              to="/dashboard?tab=bookings"
              active={tab === "bookings"}
              icon={() => <MdAssignment className="text-orange-400" />}
            >
              Bookings
            </Sidebar.Item>
          )}

          {currentUser.isAdmin && (
            <Sidebar.Item
              as={Link}
              to="/dashboard?tab=users"
              active={tab === "users"}
              icon={() => <HiOutlineUserGroup className="text-orange-400" />}
            >
              Users
            </Sidebar.Item>
          )}

          <Sidebar.Item
            icon={() => <HiArrowSmRight className="text-orange-400" />}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
