import SearchBar from "./dest-dropdown";

export default function Waypoint({ days, destinations, onChange }) {
    const handleSelectionChange = (day, value) => {
      onChange(day, value); // Call the parent-provided function to update form data
    };
  
    return (
      <>
        {Array.from({ length: days }, (_, i) => (
          <div key={`waypoint-${i}`} className="mb-4">
            <label
              htmlFor={`waypoint-${i}`}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Day {i + 1}:
            </label>
            <SearchBar
              id={`waypoint-${i}`}
              onChange={(value) => handleSelectionChange(i + 1, value)} // Pass day and value
            />
          </div>
        ))}
      </>
    );
  }
