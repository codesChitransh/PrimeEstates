import { BrowserRouter,Route,Routes } from 'react-router-dom'

import React from 'react'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import About from './pages/About'
import Header from './components/header'
export default function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/sign-in" element={<Signin/>}/>
      <Route path="/sign-up" element={<Signup/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/about" element={<About/>}/>

    </Routes>
    </BrowserRouter>
  )

}
