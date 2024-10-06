//import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import About from "./pages/About";
import MapPage from "./pages/MapPage";
import HomePage from "./pages/HomePage";
import Register from "./pages/Register";
import DestinationDetails from "./pages/DestinationDetails";
import Hotels from "./pages/Hotels";
import Vehicles from "./pages/Vehicles";
import Tours from "./pages/Tours";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/map" element={<MapPage />}></Route>
          <Route path="/mappage" element={<MapPage />}></Route>
        </Route>
        <Route path="/signin" element={<SignIn />}></Route>
       
        <Route path="/register" element={<Register />}></Route>
        
        <Route
          path="/destinationdetails"
          element={<DestinationDetails />}
        ></Route>
        <Route path="/hotels" element={<Hotels />}></Route>
        <Route path="/vehicles" element={<Vehicles />}></Route>
        <Route path="/tours" element={<Tours />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
