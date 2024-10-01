//import React from "react";
import CustomMap from "../components/mapPage/Map";
import MapSelectionBox from "../components/mapPage/MapSelectionBox";

export default function MapPage() {
  return (
    <div className="flex items-center max-w-7xl mx-auto">
      <div className="w-1/2 h-full bg-black">
        <MapSelectionBox/>
      </div>
      <div className="w-1/2 flex justify-center">
        <CustomMap />
      </div>
    </div>
  );
}
