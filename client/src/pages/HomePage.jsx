//import React from "react";
import HotelsList from "../components/hotelpages/HotelsList";
import SubscribeBanner from "../components/homePage/SubscribeBanner";
//import Footer from "../components/Footer";
import Div01 from "../components/homePage/div01";
import Div02 from "../components/homePage/div02";

export default function HomePage() {
  return (
    <div className="bg-[#fefcfb]">
      <Div01 />
      <Div02 />
      <HotelsList />
      <SubscribeBanner />
    </div>
  );
}
