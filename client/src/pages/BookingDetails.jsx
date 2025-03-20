import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { useSelector } from "react-redux";

export default function BookingDetails() {
  const { currentUser } = useSelector((state) => state.user);
  const { id } = useParams();
  const [tripPlan, setTripPlan] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateTableRow = (label, value) => {
    return value ? (
      <tr className="border border-gray-300">
        <td className="p-2 bg-gray-100 font-semibold">{label}:</td>
        <td className="p-2 border-l border-gray-300">{value}</td>
      </tr>
    ) : null;
  };

  useEffect(() => {
    const fetchTripPlan = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/trip-plan/get/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        setTripPlan(data);
        console.log(data);

        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchTripPlan();
  }, [id]);

  useEffect(() => {
    console.log("Updated tripPlan:", tripPlan);
  }, [tripPlan]); // Runs whenever tripPlan changes

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg my-4">
      <div className="flex justify-between align-center items-center">
        <div>
          <Link
            to={
              currentUser.isAdmin
                ? "/dashboard?tab=bookings"
                : "/dashboard?tab=travel-plans"
            }
          >
            <Button className="bg-amber-500">Back to Dashboard</Button>
          </Link>
        </div>
        <p>
          Booking ID: <span className="text-gray-500">{id}</span>
        </p>
        <h2 className="text-2xl font-semibold text-gray-900">
          Booking Details
        </h2>
      </div>

      {/* Test */}
      <div className="font-sans max-w-xl mx-auto p-5 border border-gray-300 rounded-lg mt-4">
        <h1 className="text-gray-800 text-center text-xl font-bold">
          New Trip Plan Created
        </h1>
        <p className="text-base text-gray-600 mt-2">
          A new trip plan has been created with the following details:
        </p>

        <table className="w-full border-collapse mt-5">
          {generateTableRow("User Name", tripPlan.userName)}
          {generateTableRow(
            "Created At",
            new Date(tripPlan.createdAt).toLocaleString()
          )}
          {generateTableRow("Contact Email", tripPlan.email)}
          {generateTableRow("Mobile Number", tripPlan.mobileNumber)}
          {generateTableRow(tripPlan.comType, tripPlan.whatsappNumber)}
          {generateTableRow(
            "Arrival Date",
            tripPlan.arrivalDate
              ? new Date(tripPlan.arrivalDate).toLocaleDateString()
              : null
          )}
          {generateTableRow(
            "Departure Date",
            tripPlan.departureDate
              ? new Date(tripPlan.departureDate).toLocaleDateString()
              : null
          )}
          {generateTableRow(
            "Arrival Time",
            tripPlan.arrivalTime
              ? tripPlan.arrivalTime
              : null
          )}
          {generateTableRow("Number of People", tripPlan.numberOfPeople)}
          {generateTableRow("Number of Adults", tripPlan.numberOfAdults)}
          {generateTableRow("Number of Children", tripPlan.numberOfChildren)}
          {generateTableRow(
            "General Comments",
            tripPlan.dateComments
              ? tripPlan.dateComments
              : null
          )}
          {generateTableRow(
            "Selected Destinations",
            tripPlan.selectedDestinations?.length
              ? tripPlan.selectedDestinations.join(", ")
              : null
          )}
          {generateTableRow(
            "Location Preferences",
            tripPlan.additionalLocations || null
          )}
          {generateTableRow("Accommodation Type", tripPlan.accommodationType)}
          {generateTableRow("Meal Plan", tripPlan.mealPlan)}
          {generateTableRow(
            "Accommodation Preferences",
            tripPlan.accommodationPreference || null
          )}
          {generateTableRow("Vehicle Type", tripPlan.vehicleType)}
          {generateTableRow("Number of Vehicles", tripPlan.numberOfVehicles)}
          {generateTableRow(
            "Transport Preferences",
            tripPlan.transportPreference || null
          )}
          {generateTableRow("Status", tripPlan.status)}
        </table>
      </div>

      {/* Test */}
    </div>
  );
}
