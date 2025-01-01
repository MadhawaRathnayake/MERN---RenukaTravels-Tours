import SearchBar from "./dest-dropdown";

export default function Waypoint({ days }) {
    const renderWaypoints = () => {
      return Array.from({ length: days }, (_, i) => (
        <div key={`waypoint-${i}`} className="mb-4">
          <label
            htmlFor={`waypoint-${i}`}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Day {i + 1}:
          </label>
          <SearchBar id={`waypoint-${i}`} />
        </div>
      ));
    };
  
    return <>{renderWaypoints()}</>;
