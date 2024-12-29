import React from "react";
import "../index.css";

import Section01 from "../components/homePage/section01.jsx";
import Section02 from "../components/homePage/section02.jsx";

export default function NewHomePage() {
  return (
    <section>
        <div className="basic-struture">
          <Section01 />
        </div>
      <div className="bg-blue-50 my-12 p-0">
        <div className="basic-struture">
          <Section02 />
        </div>
      </div>
    </section>
    
  );
}
