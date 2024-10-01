"use client";

import { useRef, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";

export default function CustomMap() {
  const position = { lat: 7.8731, lng: 80.7718 };
  const [open, setOpen] = useState(false);

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);

  async function calculateRoute() {
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API}>
      <div style={{ height: "80vh", width: "80%" }}>
        <Map
          zoom={8}
          center={position}
          mapId={import.meta.env.VITE_MAP_ID}
          fullscreenControl={false}
          zoomControl={false}
          streetViewControl={false}
        ></Map>
      </div>
    </APIProvider>
  );
}
