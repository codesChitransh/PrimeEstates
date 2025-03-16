import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import About from './pages/About';
import PrivateRoute from './components/privateroute';
import Header from './components/Header';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import { useSelector } from 'react-redux';

export default function App() {
  const { currentUser } = useSelector((state) => state.user); 

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        
        <Route path="/" element={currentUser ? <Navigate to="/home" /> : <Signin />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:listingId" element={<UpdateListing />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
