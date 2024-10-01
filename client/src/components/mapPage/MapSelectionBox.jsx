import React from "react";

const MapSelectionBox = () => {
  return (
  <div className="bg-blue-100 p-0">
    <div id="floating-panel">
      <strong>Start:</strong>
      <select id="start">
        <option value="Colombo">Colombo</option>
        <option value="Katunayake">Katunayake</option>
      </select>
      <br />
      <strong>Waypoint:</strong>
      <select id="waypoint">
        <option value="Galle">Galle</option>
        <option value="Dambulla">Dambulla</option>
      </select>
      <br />
      <strong>End:</strong>
      <select id="end">
        <option value="Hambanthota">Hambanthota</option>
        <option value="Polonnaruwa">Polonnaruwa</option>
      </select>
    </div>
  </div>

);
};

export default MapSelectionBox;
