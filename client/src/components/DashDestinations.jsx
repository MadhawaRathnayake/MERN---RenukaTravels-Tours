import React from "react";

export default function DashDestinations() {
  return (
    <div className="w-full h-full flex justify-end items-start mr-3.5">
      <a href="/create-destination">
        <button className="bg-[#F4AC20] text-white py-2 px-6 rounded-lg hover:bg-[#f49120]">
          Create a new Destination
        </button>
      </a>
    </div>
  );
}
