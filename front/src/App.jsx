import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import MyOrders from "./pages/MyOrders/MyOrders";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/myorders" element={<MyOrders />} />
        </Routes>
      </div>
      <Footer />

      {/* Embed Dialogflow chatbot */}
      <iframe
        title="Chatbot"
        allow="microphone;"
        width="350"
        height="500"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          border: "none",
          zIndex: 1000,
        }}
        src="https://console.dialogflow.com/api-client/demo/embedded/171f199a-c9a2-4b6d-ac95-c1424e476e02"
      ></iframe>
    </>
  );
};

export default App;
