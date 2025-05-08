import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  HiArrowNarrowUp,
  HiOutlineUserGroup,
  HiClipboardCheck,
  HiOutlineTicket,
} from "react-icons/hi";
import { FiMapPin } from "react-icons/fi";
import { FaCar } from "react-icons/fa";

import { HiOfficeBuilding } from "react-icons/hi"; // Updated icon for Hotels
import UserStatsChart from "./DashCharts/UserStatsChart";
import VehicleStatsChart from "./DashCharts/VehicleStatsChart";
import DestinationBarChart from "./DashCharts/DestChart";
//import HotelChart from "./DashCharts/HotelChart";

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [totalHotels, setTotalHotels] = useState(0);
  const [lastMonthHotels, setLastMonthHotels] = useState(0);
  const [destinations, setDestinations] = useState([]);
  const [totalDestinations, setTotalDestinations] = useState(0);
  const [lastMonthDestinations, setLastMonthDestinations] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [lastMonthVehicles, setLastMonthVehicles] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  //const [totalComments,setTotalComments] = useState(0);

  const [lastMonthUsers, setLastMonthUsers] = useState(0);

  //const [lastMonthComments,setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchVehicles = async () => {
      try {
        const res = await fetch("/api/vehicles/getvehicles?limit=5");
        const data = await res.json();
        if (res.ok) {
          setVehicles(data.vehicles);
          setTotalVehicles(data.totalVehicles);
          setLastMonthVehicles(data.lastMonthVehicles);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchDestinations = async () => {
      try {
        const res = await fetch("/api/destination/get-dest?limit=5");
        const data = await res.json();
        if (res.ok) {
          setDestinations(data.destinations);
          setTotalDestinations(data.totalDestinations);
          setLastMonthDestinations(data.lastMonthDestinations);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchHotels = async () => {
      try {
        const res = await fetch("/api/hotels/?limit=5");
        const data = await res.json();
        if (res.ok) {
          setHotels(data.hotels);
          setTotalHotels(data.totalHotels);
          setLastMonthHotels(data.lastMonthHotels);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchHotels();
      fetchDestinations();
      fetchUsers();
      fetchVehicles();
    }
  }, [currentUser]);

  return (
    <>
      {currentUser.isAdmin ? (
        <div className="p-3 md:mx-auto ">
          <div className="flex flex-wrap  gap-4 justify-center">
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
              <div className="flex justify-between">
                <div className="">
                  <h3 className="text-gray-500 text-md uppercase">
                    Total Users
                  </h3>
                  <p className="text-2xl">{totalUsers}</p>
                </div>
                <HiOutlineUserGroup className="bg-orange-400 text-white rounded-full text-5xl p-3 shadow-lg" />
              </div>
              <UserStatsChart />
              <div className="flex gap-2 text-sm">
                <span className="text-green-500 flex items-center">
                  <HiArrowNarrowUp />
                  {lastMonthUsers}
                </span>
                <div className="text-gray-500">Last Month</div>
              </div>
            </div>

            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
              <div className="flex justify-between">
                <div className="">
                  <h3 className="text-gray-500 text-md uppercase">
                    Total Vehicles
                  </h3>
                  <p className="text-2xl">{totalVehicles}</p>
                </div>
                <FaCar className="bg-orange-400 text-white rounded-full text-5xl p-3 shadow-lg" />
              </div>
              <VehicleStatsChart />
              <div className="flex gap-2 text-sm">
                <span className="text-green-500 flex items-center">
                  <HiArrowNarrowUp />
                  {lastMonthVehicles}
                </span>
                <div className="text-gray-500">Last Month</div>
              </div>
            </div>

            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
              <div className="flex justify-between">
                <div className="">
                  <h3 className="text-gray-500 text-md uppercase">
                    Total Destinations
                  </h3>
                  <p className="text-2xl">{totalDestinations}</p>
                </div>
                <FiMapPin className="bg-orange-400 text-white rounded-full text-5xl p-3 shadow-lg" />
              </div>
              <DestinationBarChart />
              <div className="flex gap-2 text-sm">
                <span className="text-green-500 flex items-center">
                  <HiArrowNarrowUp />
                  {lastMonthDestinations}
                </span>
                <div className="text-gray-500">Last Month</div>
              </div>
            </div>

            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
              <div className="flex justify-between">
                <div className="">
                  <h3 className="text-gray-500 text-md uppercase">
                    Total Tours
                  </h3>
                  <p className="text-2xl">{totalDestinations}</p>
                </div>
                <HiClipboardCheck className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
              </div>
              <div className="flex gap-2 text-sm">
                <span className="text-green-500 flex items-center">
                  <HiArrowNarrowUp />
                  {lastMonthDestinations}
                </span>
                <div className="text-gray-500">Last Month</div>
              </div>
            </div>

            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
              <div className="flex justify-between">
                <div className="">
                  <h3 className="text-gray-500 text-md uppercase">
                    Total Hotels
                  </h3>
                  <p className="text-2xl">{totalHotels}</p>
                </div>
                <HiOfficeBuilding className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
              </div>
              {/* <HotelChart/> */}
              <div className="flex gap-2 text-sm">
                <span className="text-green-500 flex items-center">
                  <HiArrowNarrowUp />
                  {lastMonthHotels}
                </span>
                <div className="text-gray-500">Last Month</div>
              </div>
            </div>

            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
              <div className="flex justify-between">
                <div className="">
                  <h3 className="text-gray-500 text-md uppercase">
                    Total Bookings
                  </h3>
                  <p className="text-2xl">{lastMonthDestinations}</p>
                </div>
                <HiOutlineTicket className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
              </div>
              <div className="flex gap-2 text-sm">
                <span className="text-green-500 flex items-center">
                  <HiArrowNarrowUp />
                  {lastMonthDestinations}
                </span>
                <div className="text-gray-500">Last Month</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-0 py-3 mx-auto justify-center">
            <div
              className="flex flex-col w-full md:w-auto shadow-md p-2 
        rounded-md dark:bg-gray-800"
            >
              <div className="flex justify-between p-3 text-sm font-semibold">
                <h1 className="text-center p-2">Recent Users</h1>
                <Button
                  outline
                  className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white"
                >
                  <Link to={"/dashboard?tab=users"}>See all</Link>
                </Button>
              </div>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>User Image</Table.HeadCell>
                  <Table.HeadCell>User Name</Table.HeadCell>
                </Table.Head>
                {users &&
                  users.map((user) => (
                    <Table.Body key={user._id} className="divide-y">
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        {/* Render your table cells (Table.Cell) here */}
                        <Table.Cell>
                          <img
                            src={user.profilePicture}
                            alt="user"
                            className="w-10 h-10 rounded-full bg-gray-500"
                          />
                        </Table.Cell>
                        <Table.Cell>{user.username}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
              </Table>
            </div>

            <div
              className="flex flex-col w-full md:w-auto shadow-md p-2 
        rounded-md dark:bg-gray-800"
            >
              <div className="flex justify-between p-3 text-sm font-semibold">
                <h1 className="text-center p-2">Recent Vehicles</h1>
                <Button
                  outline
                  className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white"
                >
                  <Link to={"/dashboard?tab=vehicles"}>See all</Link>
                </Button>
              </div>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Vehicle Image</Table.HeadCell>
                  <Table.HeadCell>Model</Table.HeadCell>
                </Table.Head>
                {vehicles &&
                  vehicles.map((vehicles) => (
                    <Table.Body key={vehicles._id} className="divide-y">
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        {/* Render your table cells (Table.Cell) here */}
                        <Table.Cell>
                          <img
                            src={vehicles.image}
                            alt="image"
                            className="w-14 h-10 rounded-md bg-gray-500"
                          />
                        </Table.Cell>
                        <Table.Cell>{vehicles.title}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
              </Table>
            </div>

            <div
              className="flex flex-col w-full md:w-auto shadow-md p-2 
        rounded-md dark:bg-gray-800"
            >
              <div className="flex justify-between p-3 text-sm font-semibold">
                <h1 className="text-center p-2">Recent Hotels</h1>
                <Button
                  outline
                  className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white"
                >
                  <Link to={"/dashboard?tab=hotels"}>See all</Link>
                </Button>
              </div>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Hotel Image</Table.HeadCell>
                  <Table.HeadCell>Hotel Name</Table.HeadCell>
                </Table.Head>
                {hotels &&
                  hotels.map((hotel) => (
                    <Table.Body key={hotel._id} className="divide-y">
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>
                          <img
                            src={hotel.hotelImageURL}
                            alt={hotel.name}
                            className="w-14 h-10 rounded-md bg-gray-500"
                          />
                        </Table.Cell>
                        <Table.Cell>{hotel.name}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
              </Table>
            </div>

            <div
              className="flex flex-col w-full md:w-auto shadow-md p-2 
        rounded-md dark:bg-gray-800"
            >
              <div className="flex justify-between p-3 text-sm font-semibold">
                <h1 className="text-center p-2">Recent Destinations</h1>
                <Button
                  outline
                  className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white"
                >
                  <Link to={"/dashboard?tab=destinations"}>See all</Link>
                </Button>
              </div>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Image</Table.HeadCell>
                  <Table.HeadCell>City</Table.HeadCell>
                  {/* <Table.HeadCell>Category</Table.HeadCell> */}
                </Table.Head>
                {destinations &&
                  destinations.map((Destination) => (
                    <Table.Body key={Destination._id} className="divide-y">
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        {/* Render your table cells (Table.Cell) here */}
                        <Table.Cell>
                          <img
                            src={Destination.destImage}
                            alt="dest"
                            className="w-14 h-10 rounded-md bg-gray-500"
                          />
                        </Table.Cell>
                        <Table.Cell className="w-48">
                          {Destination.destinationName}
                        </Table.Cell>
                        {/* <Table.Cell className="w-5">
        {post.category}
      </Table.Cell> */}
                      </Table.Row>
                    </Table.Body>
                  ))}
              </Table>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-fit flex items-center justify-center">
          <div className="shadow-2xl rounded-2xl p-8 max-w-3xl w-full text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-yellow-300 py-4">
              Welcome to Renuka Tours and Travels
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
              Dashboard
            </h2>
            <p className="text-gray-600 text-md md:text-lg mb-6">
              Explore the beauty of Sri Lanka with a travel partner who cares.
              We provide the perfect platform to plan your dream trip, with
              complete customization and a personalized quotation system. Use
              our customizer to build your travel plan exactly how you want it.
              Once you’re done, our agents will reach out to guide you through
              pricing, accommodations, and every detail of your journey.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link
                to="/dashboard?tab=profile"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-md text-center transition"
              >
                Edit Profile
              </Link>
              <Link
                to="/dashboard?tab=travel-plans"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium shadow-md text-center transition"
              >
                Your Travel Plans
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
