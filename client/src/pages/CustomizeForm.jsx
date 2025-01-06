import "../index.css";
import { useEffect, useState } from "react";
import { Datepicker, TextInput, Timeline, Button } from "flowbite-react";
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";

export default function CustomizeForm() {
  const [formData, setFormData] = useState({});
  const [zoom, setZoom] = useState(7.9);
  const position = { lat: 7.87, lng: 80.77 };
  const [mapHeight, setMapHeight] = useState("80vh");
  const [destinations, setDestinations] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedDestinationDetails, setSelectedDestinationDetails] = useState({
    description: "",
    activities: [],
  });
  const [activeDestination, setActiveDestination] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    for (let [key, value] of formData.entries) {
      console.log({ key, value });
    }
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(`api/destination/get-dest-names`);
        const data = await response.json();
        setDestinations(data.destinations || []);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  // Handle adding a destination to the selected list
  const handleSelectDestination = (destinationName) => {
    if (!selectedDestinations.includes(destinationName)) {
      setSelectedDestinations((prev) => [...prev, destinationName]);
      handleTileClick(destinationName);
    }
  };

  // Fetch details (description and activities) of the selected destination
  const fetchDestinationDetails = async (destinationName) => {
    const response = await fetch(
      `/api/destination/get-dest?searchTerm=${destinationName}`
    );
    const data = await response.json();
    console.log("Fetched destination data:", data); // Add this line for debugging

    if (data.destinations && data.destinations.length > 0) {
      const destination = data.destinations[0];
      setSelectedDestinationDetails({
        description: destination.description,
        activities: destination.activities,
      });
    }
  };

  // Handle tile click to fetch details
  const handleTileClick = (destinationName) => {
    setActiveDestination(destinationName);
    fetchDestinationDetails(destinationName);
  };

  const handleRemoveDestination = (destinationName) => {
    setSelectedDestinations((prev) =>
      prev.filter((item) => item !== destinationName)
    );
  };

  useEffect(() => {
    const updateHeight = () => {
      const screenHeight = window.innerHeight;

      if (screenHeight < 600) {
        setMapHeight("50vh"); // Smaller height for small screens
      } else if (screenHeight < 800) {
        setMapHeight("65vh");
      } else {
        setMapHeight("80vh"); // Larger height for bigger screens
      }
    };

    // Update height on component mount and window resize
    updateHeight();
    window.addEventListener("resize", updateHeight);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <section>
      <div className="py-8 basic-struture shadow-xl">
        {/* ***********************************row01*********************************** */}
        <div className="py-2 yellow-bg">
          <h3 className="text-xl text-white text-center">
            General Information
          </h3>
        </div>

        {/* ***********************************row02*********************************** */}
        <div className="py-2 grid grid-cols-1 sm:grid-rows-3 md:grid-rows-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {/* column01 */}
          <div className="pt-2">
            <p className="text-gray-700 font-semibold sm:ml-2 md:ml-4">
              Arrival Date:
            </p>
          </div>
          {/* column02 */}
          <div className="pt-2">
            <p className="text-gray-700 font-semibold sm:ml-2 md:ml-4">
              Departure Date:
            </p>
          </div>
          {/* column03 */}
          <div className="pt-2">
            <p className="text-gray-700 font-semibold sm:ml-2 md:ml-4">
              Arrival Time (approximate):
            </p>
          </div>
        </div>
        {/* ***********************************row03*********************************** */}
        <div className="pb-2 grid grid-cols-1 sm:grid-rows-3 md:grid-rows-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {/* column01 */}
          <div>
            <Datepicker className="w-3/4 md:w-1/2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          {/* column02 */}
          <div>
            <Datepicker className="w-3/4 md:w-1/2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          {/* column03 */}
          <div>
            <TextInput
              type="text"
              placeholder="Arrival Time"
              id="comment"
              className="flex-1"
            />
          </div>
        </div>
        {/* ***********************************row04*********************************** */}
        <div className="py-2 grid grid-cols-1 sm:grid-rows-3 md:grid-rows-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {/* column01 */}
          <div className="pt-2">
            <p className="text-gray-700 font-semibold sm:ml-2 md:ml-4">
              Number of people:
            </p>
          </div>
          {/* column02 */}
          <div className="pt-2">
            <p className="text-gray-700 font-semibold sm:ml-2 md:ml-4">
              Number of adults:
            </p>
          </div>
          {/* column03 */}
          <div className="pt-2">
            <p className="text-gray-700 font-semibold sm:ml-2 md:ml-4">
              Number of children:
            </p>
          </div>
        </div>
        {/* ***********************************row05*********************************** */}
        <div className="pb-2 grid grid-cols-1 sm:grid-rows-3 md:grid-rows-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {/* column01 */}
          <div>
            <TextInput
              type="text"
              placeholder="Arrival Time"
              id="comment"
              className="flex-1"
            />
          </div>
          {/* column02 */}
          <div>
            <TextInput
              type="text"
              placeholder="Arrival Time"
              id="comment"
              className="flex-1"
            />
          </div>
          {/* column03 */}
          <div>
            <TextInput
              type="text"
              placeholder="Arrival Time"
              id="comment"
              className="flex-1"
            />
          </div>
        </div>
        {/* ***********************************row06*********************************** */}
        <div className="py-2">
          <p className="text-gray-700 font-semibold text-center">
            If you have any comments about the date please mention here:
          </p>
        </div>
        {/* ***********************************row07*********************************** */}
        <div className="pb-2 flex justify-center">
          <TextInput
            type="text"
            placeholder="Any Comments about the date"
            id="comment"
            className="flex-1"
          />
        </div>

        {/* ***********************************row08*********************************** */}
        <div className="py-2 yellow-bg">
          <h3 className="text-xl text-white text-center">
            Location Information
          </h3>
        </div>
        {/* ***********************************row09*********************************** */}
        <div className="py-2">
          <p className="text-gray-700 font-semibold text-center">
            Select the locations you are interest to visit:
          </p>
        </div>

        {/* ***************************************************cards*************************************************** */}

        {/* ***********************************row10*********************************** */}
        <div className="py-2 grid grid-cols-1 sm:grid-rows-2 md:grid-rows-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* ***************************************************cards01*************************************************** */}
          <div className="py-2 border-2 rounded-lg shadow-lg">
            <div className="py-2">
              <p className="text-gray-700 font-semibold sm:ml-2 md:ml-4">
                Locations:
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-rows-2 md:grid-rows-1 md:grid-cols-2 lg:grid-cols-2 gap-4 px-4">
              <TextInput
                type="text"
                placeholder="&#x1F50D; Search"
                id="comment"
                className="flex-1"
              />
              <select
                id="location-selection"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                onChange={(e) => handleSelectDestination(e.target.value)}
              >
                <option value="" disabled selected>
                  Select
                </option>
                {destinations.length > 0 ? (
                  destinations.map((destination, index) => (
                    <option key={index} value={destination.destinationName}>
                      {destination.destinationName}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading...</option>
                )}
              </select>
            </div>
            {/* **********tiles********** */}
            <div className="mt-4 px-4 flex flex-wrap gap-2">
              {selectedDestinations.map((destination, index) => (
                <div
                  key={index}
                  className={`flex items-center px-4 py-2 rounded-md border-2 text-sm text-yellow-400 cursor-pointer
          ${
            activeDestination === destination
              ? "border-blue-500"
              : "border-gray-200"
          }`}
                  onClick={() => handleTileClick(destination)}
                >
                  <span>{destination}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent tile click when removing
                      handleRemoveDestination(destination);
                    }}
                    className="ml-2 text-red-500"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            <div className="py-2">
              <p className="text-gray-700 font-semibold sm:ml-2 md:ml-4">
                Describe any additional locations if you have in your mind:
              </p>
            </div>
            <div className="px-4">
              <textarea
                id="comment"
                placeholder="Describe additional locations"
                className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                rows="2"
              />
            </div>
            <div className="py-2">
              <p className="text-gray-700 font-semibold sm:ml-2 md:ml-4">
                Details about the location you have currently selected:
              </p>
            </div>
            <div className="mt-4 px-4">
              <div>
                <p
                  className="text-justify"
                  dangerouslySetInnerHTML={{
                    __html:
                      selectedDestinationDetails.description ||
                      "Select a destination to see details",
                  }}
                ></p>
              </div>
              <div>
                <strong>Activities:</strong>
                <ul className="ml-12">
                  {selectedDestinationDetails.activities.length > 0 ? (
                    selectedDestinationDetails.activities.map(
                      (activity, index) => <li key={index}>• {activity}</li>
                    )
                  ) : (
                    <li>No activities available</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* ***************************************************cards02*************************************************** */}
          <div className="py-2 rounded-lg shadow-lg flex justify-center items-center border-2">
            <div style={{ height: mapHeight, width: "97.5%" }}>
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API}>
                <Map
                  zoom={zoom}
                  center={position}
                  mapId={import.meta.env.VITE_MAP_ID}
                  fullscreenControl={false}
                  streetViewControl={false}
                  zoomControl={false}
                  gestureHandling="none"
                >
                  <Directions selectedDestinations={selectedDestinations} />
                </Map>
              </APIProvider>
            </div>
          </div>
        </div>

        {/* ***********************************row11*********************************** */}
        <div className="py-2 yellow-bg">
          <h3 className="text-xl text-white text-center">Accommodation</h3>
        </div>
        {/* ***********************************row12*********************************** */}
        <div className="py-2 grid grid-cols-1 sm:grid-rows-3 md:grid-rows-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {/* column01 */}
          <div className="pt-2">
            <p className="text-gray-700 font-semibold sm:ml-2 md:ml-4">
              Accomodation Type:
            </p>
          </div>
          {/* column02 */}
          <div className="pt-2">
            <p className="text-gray-700 font-semibold sm:ml-2 md:ml-4">
              Number of Bedrooms:
            </p>
          </div>
          {/* column03 */}
          <div className="pt-2">
            <p className="text-gray-700 font-semibold sm:ml-2 md:ml-4">
              Describe any Specific preference:
            </p>
          </div>
        </div>
        {/* ***********************************row13*********************************** */}
        <div className="pb-2 grid grid-cols-1 sm:grid-rows-3 md:grid-rows-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {/* column01 */}
          <div>
            <select
              id="start"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
            >
              <option value="" disabled selected>
                Select a Type
              </option>
              <option value="Colombo">Best-Budget</option>
              <option value="Katunayake">Mid-Range</option>
              <option value="Katunayake">Luxury</option>
            </select>
          </div>
          {/* column02 */}
          <div>
            <TextInput
              type="text"
              placeholder="Number of Bedrooms"
              id="comment"
              className="flex-1"
            />
          </div>
          {/* column03 */}
          <div>
            <TextInput
              type="text"
              placeholder="Describe Any Preference"
              id="comment"
              className="flex-1"
            />
          </div>
        </div>
        {/* ***********************************row14*********************************** */}
        <div className="py-2 yellow-bg">
          <h3 className="text-xl text-white text-center">Transport</h3>
        </div>
        {/* ***********************************row15*********************************** */}
        <div className="py-2 grid grid-cols-1 sm:grid-rows-3 md:grid-rows-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {/* column01 */}
          <div className="pt-2">
            <p className="text-gray-700 font-semibold sm:ml-2 md:ml-4">
              Vehicle Type:
            </p>
          </div>
          {/* column02 */}
          <div className="pt-2">
            <p className="text-gray-700 font-semibold sm:ml-2 md:ml-4">
              Number of Vehicles:
            </p>
          </div>
          {/* column03 */}
          <div className="pt-2">
            <p className="text-gray-700 font-semibold sm:ml-2 md:ml-4">
              Describe any Specific preference:
            </p>
          </div>
        </div>
        {/* ***********************************row13*********************************** */}
        <div className="pb-2 grid grid-cols-1 sm:grid-rows-3 md:grid-rows-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {/* column01 */}
          <div>
            <select
              id="start"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
            >
              <option value="" disabled selected>
                Select a Type
              </option>
              <option value="Sedan">Sedan</option>
              <option value="Sedan-VIP">Sedan-VIP</option>
              <option value="SUV">SUV</option>
              <option value="SUV-VIP">SUV-VIP</option>
              <option value="High-Roof-Van">High Roof Van</option>
              <option value="Bus">Bus</option>
              {/* to-do : types should get dynamically */}
            </select>
          </div>
          {/* column02 */}
          <div>
            <TextInput
              type="text"
              placeholder="Number of Vehicles"
              id="comment"
              className="flex-1"
            />
          </div>
          {/* column03 */}
          <div>
            <TextInput
              type="text"
              placeholder="Describe Any Preference"
              id="comment"
              className="flex-1"
            />
          </div>
        </div>
        {/* ***********************************row17*********************************** */}
        <div className="py-2">
          <p className="text-gray-400 italic">
            *Don’t worry about the details you’ve entered; you can modify any
            feature later by discussing it with our service agent. Once you
            submit the form, we’ll receive your inquiry. You can create multiple
            inquiries. We’ll contact you through the provided contact details
            for further confirmation.
          </p>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#F4AC20] text-xl text-white font-semibold py-4 px-12  rounded-lg hover:bg-[#f49120]"
          >
            Submit Your Plan
          </button>
        </div>
      </div>
    </section>
  );
}

// ***********************************************************************Scripts*********************************************************************** //

function Directions({ selectedDestinations }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [hasRoute, setHasRoute] = useState(false);
  const [optimizedOrder, setOptimizedOrder] = useState([]);

  const selected = routes[routeIndex];
  const leg = selected ? selected.legs[0] : null;

  // Function to calculate distance between two points using Google's Distance Matrix Service
  const calculateDistance = async (origin, destination) => {
    return new Promise((resolve, reject) => {
      const service = new routesLibrary.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            resolve(response.rows[0].elements[0].distance.value);
          } else {
            reject(new Error("Failed to calculate distance"));
          }
        }
      );
    });
  };

  // Function to optimize route using nearest neighbor algorithm
  const optimizeRoute = async (destinations) => {
    if (destinations.length <= 2) return destinations;

    let unvisited = [...destinations.slice(1, -1)]; // Exclude first and last points
    let optimizedRoute = [destinations[0]]; // Start with the first destination
    let currentPoint = destinations[0];

    while (unvisited.length > 0) {
      let shortestDistance = Infinity;
      let nearestPoint = null;
      let nearestIndex = -1;

      // Find the nearest unvisited point
      for (let i = 0; i < unvisited.length; i++) {
        try {
          const distance = await calculateDistance(currentPoint, unvisited[i]);
          if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestPoint = unvisited[i];
            nearestIndex = i;
          }
        } catch (error) {
          console.error("Error calculating distance:", error);
        }
      }

      if (nearestPoint) {
        optimizedRoute.push(nearestPoint);
        unvisited.splice(nearestIndex, 1);
        currentPoint = nearestPoint;
      }
    }

    // Add the last destination back
    optimizedRoute.push(destinations[destinations.length - 1]);
    return optimizedRoute;
  };

  // Function to calculate the route based on optimized destinations
  const calculateRoute = async (destinations) => {
    if (!directionsService || !directionsRenderer || destinations.length < 2)
      return;

    try {
      // Optimize the route order
      const optimizedDestinations = await optimizeRoute(destinations);
      setOptimizedOrder(optimizedDestinations);

      const origin = optimizedDestinations[0];
      const destination =
        optimizedDestinations[optimizedDestinations.length - 1];
      const waypoints = optimizedDestinations.slice(1, -1).map((location) => ({
        location,
        stopover: true,
      }));

      const response = await directionsService.route({
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        optimizeWaypoints: true, // Add Google's built-in optimization
      });

      directionsRenderer.setDirections(response);
      setRoutes(response.routes);
      setHasRoute(true);
    } catch (error) {
      console.error("Error calculating route:", error);
      setHasRoute(false);
    }
  };

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));

    return () => {
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
    };
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    if (selectedDestinations && selectedDestinations.length >= 2) {
      calculateRoute(selectedDestinations);
    } else {
      if (directionsRenderer) {
        directionsRenderer.setDirections(null);
      }
      setHasRoute(false);
    }
  }, [selectedDestinations, directionsService, directionsRenderer]);

  useEffect(() => {
    if (!directionsRenderer || !hasRoute) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer, hasRoute]);

  if (!hasRoute || !leg) return null;

  // return (
  //   <div className="directions-info">
  //     <div>Optimized Route Order:</div>
  //     <div className="text-sm text-gray-600">
  //       {optimizedOrder.map((dest, index) => (
  //         <div key={index}>
  //           {index + 1}. {dest}
  //         </div>
  //       ))}
  //     </div>
  //     <div className="mt-2">Total Distance: {leg.distance.text}</div>
  //     <div>Total Duration: {leg.duration.text}</div>
  //     {routes.length > 1 && (
  //       <button
  //         onClick={() => setRouteIndex((i) => (i + 1) % routes.length)}
  //         className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
  //       >
  //         Show alternative route ({routeIndex + 1} of {routes.length})
  //       </button>
  //     )}
  //   </div>
  // );
}
