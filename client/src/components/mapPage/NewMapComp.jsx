import { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
} from "@vis.gl/react-google-maps";

import SearchBar from "../shared/dest-dropdown";
import TimelineComponent from "./timeline";
import Directions from "./Directions";
import Waypoint from "../shared/waypoint"; // Import the updated Waypoint component

export default function MapComp() {
  const [zoom, setZoom] = useState(7.9);
  const [days, setDays] = useState(1);
  const position = { lat: 7.87, lng: 80.77 };
  const [mapHeight, setMapHeight] = useState("80vh");

  useEffect(() => {
    const updateZoom = () => {
      const screenHeight = window.innerHeight;
      let calculatedZoom = screenHeight < 600 ? 6.5 : screenHeight < 800 ? 7.5 : 7.9;
      setZoom(calculatedZoom);
    };

    updateZoom();
    window.addEventListener("resize", updateZoom);
    return () => window.removeEventListener("resize", updateZoom);
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      const screenHeight = window.innerHeight;
      setMapHeight(screenHeight < 600 ? "50vh" : screenHeight < 800 ? "65vh" : "80vh");
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <section className="w-full">
      <form className="border rounded-2xl shadow-xl mb-4">
        <div className="flex m-8 flex-col md:flex-row md:items-center justify-center md:space-x-8 space-y-4 md:space-y-0">
          <div className="w-full md:w-1/4 flex flex-col items-center">
            <h3 className="text-center md:text-left mb-2 text-sm font-medium text-gray-700">
              How many days are you willing to stay in Sri Lanka:
            </h3>
            <select
              id="days"
              type="number"
              required
              onChange={(e) => setDays(parseInt(e.target.value))}
              value={days}
              className="w-3/4 md:w-1/2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center mb-8">
          <div className="w-1/2 h-full">
            <div className="h-full flex justify-center items-center">
              <div id="floating-panel" className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <div className="mb-4">
                  <label
                    htmlFor="start"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Start:
                  </label>
                  <SearchBar id="start" />
                </div>
                <Waypoint days={days} />
                <div>
                  <label
                    htmlFor="end"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    End:
                  </label>
                  <SearchBar id="end" />
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/2 flex justify-center">
            <div style={{ height: mapHeight, width: "80%" }}>
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
                  <Directions />
                </Map>
              </APIProvider>
            </div>
          </div>
        </div>
      </form>

      <TimelineComponent days={days} />
    </section>
  );
}
