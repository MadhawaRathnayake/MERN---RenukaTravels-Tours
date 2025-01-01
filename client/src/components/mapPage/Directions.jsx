import { useState,useEffect } from "react";
import {
    APIProvider,
    Map,
    useMapsLibrary,
    useMap,
  } from "@vis.gl/react-google-maps";

function Directions() {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const [hasRoute, setHasRoute] = useState(false);
  
    const selected = routes[routeIndex];
    const leg = selected ? selected.legs[0] : null;
  
    const calculateRoute = (start, waypointsArray, end) => {
      if (!directionsService || !directionsRenderer || !start) return;
  
      // Filter out any empty waypoints
      const validWaypoints = waypointsArray
        .filter((waypoint) => waypoint !== "")
        .map((location) => ({ location, stopover: true }));
  
      const destination = end || 
        (validWaypoints.length > 0 && validWaypoints[validWaypoints.length - 1].location);
  
      if (!destination) return;
  
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
          setHasRoute(true);
        })
        .catch((error) => {
          console.error("Error calculating route:", error);
          setHasRoute(false);
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
        const start = document.getElementById("start")?.value;
        const end = document.getElementById("end")?.value;
        
        // Collect all waypoint values dynamically
        const waypoints = [];
        let waypointIndex = 0;
        let waypointElement = document.getElementById(`waypoint-${waypointIndex}`);
        
        while (waypointElement) {
          waypoints.push(waypointElement.value);
          waypointIndex++;
          waypointElement = document.getElementById(`waypoint-${waypointIndex}`);
        }
  
        // Calculate route if we have at least a start point and either waypoints or an end point
        if (start && (waypoints.some(wp => wp) || end)) {
          calculateRoute(start, waypoints, end);
        }
      };
  
      // Add event listener to start and end points
      const startElement = document.getElementById("start");
      const endElement = document.getElementById("end");
      
      if (startElement) startElement.addEventListener("change", onChangeHandler);
      if (endElement) endElement.addEventListener("change", onChangeHandler);
  
      // Add event listeners to all waypoints
      const waypointListeners = [];
      let waypointIndex = 0;
      let waypointElement = document.getElementById(`waypoint-${waypointIndex}`);
      
      while (waypointElement) {
        waypointElement.addEventListener("change", onChangeHandler);
        waypointListeners.push({ element: waypointElement, index: waypointIndex });
        waypointIndex++;
        waypointElement = document.getElementById(`waypoint-${waypointIndex}`);
      }
  
      // Cleanup function
      return () => {
        if (startElement) startElement.removeEventListener("change", onChangeHandler);
        if (endElement) endElement.removeEventListener("change", onChangeHandler);
        
        // Remove waypoint listeners
        waypointListeners.forEach(({ element }) => {
          element.removeEventListener("change", onChangeHandler);
        });
      };
    }, [directionsService, directionsRenderer]);
  
    useEffect(() => {
      if (!directionsRenderer || !hasRoute) return;
      directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer, hasRoute]);
  
    // Optional: Return route information for display
    if (!hasRoute || !leg) return null;
  
    return (
      <div className="directions-info">
        <div className="route-details">
          <p>Distance: {leg.distance.text}</p>
          <p>Duration: {leg.duration.text}</p>
        </div>
      </div>
    );
  }
  
  export default Directions;