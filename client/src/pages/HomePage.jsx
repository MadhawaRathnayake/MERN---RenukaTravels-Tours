import React from "react";
import SubscribeBanner from "../components/homePage/SubscribeBanner";
import Footer from "../components/Footer";
import Div01 from "../components/homePage/div01";
import Div02 from "../components/homePage/div02";
import Div03 from "../components/homePage/div03";

export default function HomePage() {
  return (
    <div className="bg-[#fefcfb]">
      <Div01 />
      <Div02 />
      <SubscribeBanner />
    </div>
  );
}
