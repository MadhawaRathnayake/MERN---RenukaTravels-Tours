import React, { useRef, useState } from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";

const MapComponent = () => {
  const position = { lat: 7.87, lng: 80.77 };
  const [directions, setDirections] = useState(null);

  const initMap = React.useCallback(() => {
    const map = useMap(Map);
    const directionsRenderer = new google.maps.DirectionsRenderer({ map });
    const directionsService = new google.maps.DirectionsService();

    const onChangeHandler = () => {
      const start = document.getElementById("start").value;
      const waypoint = document.getElementById("waypoint").value || "";
      const end = document.getElementById("end").value;

      calculateAndDisplayRoute(
        directionsService,
        directionsRenderer,
        start,
        waypoint,
        end
      );
    };

    document
      .getElementById("start")
      .addEventListener("change", onChangeHandler);
    document
      .getElementById("waypoint")
      .addEventListener("change", onChangeHandler);
    document.getElementById("end").addEventListener("change", onChangeHandler);

    console.log("Start:", start);
    console.log("Waypoint:", waypoint);
    console.log("End:", end);

    const calculateAndDisplayRoute = (service, renderer, s, w, e) => {
      service
        .route({
          origin: s,
          destination: e,
          waypoints: w ? [{ location: w, stopover: true }] : [],
          travelMode: google.maps.TravelMode.DRIVING,
        })
        .then((response) => {
          setDirections(response);
        })
        .catch((e) =>
          window.alert("Directions request failed due to " + e.status)
        );
    };
  }, []);

  return (
    <section className="w-full flex items-center ">
      {/* Main div01 */}
      <div className="w-1/2 h-full bg-black">
        <div className="bg-blue-100 p-0">
          <div id="floating-panel">
            <strong>Start:</strong>
            <select id="start">
              <option value="Colombo">Colombo</option>
              <option value="Katunayake">Katunayake</option>
              {/* Other options... */}
            </select>
            <br />
            <strong>Waypoint (Optional):</strong>
            <select id="waypoint">
              <option value="Galle">Galle</option>
              <option value="Dambulla">Dambulla</option>
              {/* Other options... */}
            </select>
            <br />
            <strong>End:</strong>
            <select id="end">
              <option value="Hambanthota">Hambanthota</option>
              <option value="Polonnaruwa">Polonnaruwa</option>
              {/* Other options... */}
            </select>
          </div>
        </div>
      </div>
      {/* Main div02 */}
      <div className="w-1/2 flex justify-center">
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API}>
          <div style={{ height: "80vh", width: "80%" }}>
            <Map
              zoom={7}
              center={position}
              mapId={import.meta.env.VITE_MAP_ID}
              fullscreenControl={false}
              zoomControl={false}
              streetViewControl={false}
            >
              {directions && <DirectionsRenderer directions={directions} />}
            </Map>
          </div>
        </APIProvider>
      </div>
    </section>
  );
};

export default MapComponent;
