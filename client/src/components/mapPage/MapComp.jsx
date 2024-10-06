"use client";

import { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";

export default function MapComp() {
  const position = { lat: 7.87, lng: 80.77 };

  return (
    <section className="w-full flex items-center ">
      <div className="w-1/2 h-full ">
        <div className="h-full flex justify-center items-center">
          <div
            id="floating-panel"
            className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
          >
            <div className="mb-4">
              <label
                htmlFor="start"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Start:
              </label>
              <select
                id="start"
                className="w-full px-3 py-2 border border-yellow-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Start Location</option>
                <option value="Colombo">Colombo</option>
                <option value="Katunayake">Katunayake</option>
                {/* Other options... */}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="waypoint1"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Waypoint 1 (Optional):
              </label>
              <select
                id="waypoint1"
                className="w-full px-3 py-2 border border-yellow-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">None</option>
                <option value="Galle">Galle</option>
                <option value="Dambulla">Dambulla</option>
                {/* Other options... */}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="waypoint2"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Waypoint 2 (Optional):
              </label>
              <select
                id="waypoint2"
                className="w-full px-3 py-2 border border-yellow-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">None</option>
                <option value="Kandy">Kandy</option>
                <option value="Matara">Matara</option>
                {/* Other options... */}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="waypoint3"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Waypoint 3 (Optional):
              </label>
              <select
                id="waypoint3"
                className="w-full px-3 py-2 border border-yellow-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">None</option>
                <option value="Nuwara Eliya">Nuwara Eliya</option>
                <option value="Trincomalee">Trincomalee</option>
                {/* Other options... */}
              </select>
            </div>

            <div>
              <label
                htmlFor="end"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                End:
              </label>
              <select
                id="end"
                className="w-full px-3 py-2 border border-yellow-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select End Location</option>
                <option value="Hambanthota">Hambanthota</option>
                <option value="Polonnaruwa">Polonnaruwa</option>
                {/* Other options... */}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2 flex justify-center">
        <div style={{ height: "80vh", width: "80%" }}>
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API}>
            <Map
              zoom={7.9}
              center={position}
              mapId={import.meta.env.VITE_MAP_ID}
              fullscreenControl={false}
              zoomControl={false}
              streetViewControl={false}
            >
              <Directions />
            </Map>
          </APIProvider>
        </div>
      </div>
    </section>
  );
}

function Directions() {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [hasRoute, setHasRoute] = useState(false); // To track if route is calculated

  const selected = routes[routeIndex];
  const leg = selected ? selected.legs[0] : null;

  // Function to calculate the route
  const calculateRoute = (start, waypointsArray, end) => {
    if (!directionsService || !directionsRenderer || !start) return;

    // Filter out any empty waypoints
    const validWaypoints = waypointsArray
      .filter((waypoint) => waypoint !== "")
      .map((location) => ({ location, stopover: true }));

    // Determine the destination:
    // - Use end if available; otherwise, use the last waypoint
    const destination =
      end ||
      (validWaypoints.length > 0 &&
        validWaypoints[validWaypoints.length - 1].location);

    if (!destination) return; // If no destination is available, do nothing

    directionsService
      .route({
        origin: start,
        destination: destination,
        waypoints: validWaypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
        setHasRoute(true); // Set hasRoute to true after route is calculated
      });
  };

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    const onChangeHandler = () => {
      const start = document.getElementById("start").value;
      const waypoint1 = document.getElementById("waypoint1").value;
      const waypoint2 = document.getElementById("waypoint2").value;
      const waypoint3 = document.getElementById("waypoint3").value;
      const end = document.getElementById("end").value;

      // Calculate route as soon as start and any waypoint or end is selected
      if (start && (waypoint1 || waypoint2 || waypoint3 || end)) {
        calculateRoute(start, [waypoint1, waypoint2, waypoint3], end); // Pass all waypoints to the route calculation
      }
    };

    document
      .getElementById("start")
      .addEventListener("change", onChangeHandler);
    document
      .getElementById("waypoint1")
      .addEventListener("change", onChangeHandler);
    document
      .getElementById("waypoint2")
      .addEventListener("change", onChangeHandler);
    document
      .getElementById("waypoint3")
      .addEventListener("change", onChangeHandler);
    document.getElementById("end").addEventListener("change", onChangeHandler);

    // Clean up event listeners on component unmount
    return () => {
      document
        .getElementById("start")
        .removeEventListener("change", onChangeHandler);
      document
        .getElementById("waypoint1")
        .removeEventListener("change", onChangeHandler);
      document
        .getElementById("waypoint2")
        .removeEventListener("change", onChangeHandler);
      document
        .getElementById("waypoint3")
        .removeEventListener("change", onChangeHandler);
      document
        .getElementById("end")
        .removeEventListener("change", onChangeHandler);
    };
  }, [directionsService, directionsRenderer]);

  useEffect(() => {
    if (!directionsRenderer || !hasRoute) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer, hasRoute]);

  if (!hasRoute || !leg) return null; // Don't show directions unless a route is calculated
}
