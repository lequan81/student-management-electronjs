/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import ClassAttendance from './components/ClassAttendance'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Chart from './pages/Home/Chart'
import Classes from './pages/Home/Classes'
import EditClass from './pages/Home/EditClass'
import Home from './pages/Home/Home'
import Logout from './pages/Home/Logout'
import Settings from './pages/Home/Settings'
import Page404 from './pages/Page404'

function App() {
  const [isLoggin, setIsLoggedIn] = useState(window.api.store.get('userData.isLogged'))
  useRef(() => {}, [isLoggin])

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={isLoggin ? (window.location.hash = '#/home') : <Login />} />
          <Route path="login" replace element={<Login />} />
          <Route path="signup" replace element={<Signup />} />

          <Route path="home" element={<Home />} />
          <Route path="chart" element={<Chart />} />
          <Route path="classes">
            <Route index element={<Classes />} />
            <Route path="edit/:className/:classIndex" element={<EditClass />} />
            <Route path="attendance/:className/:classIndex" element={<ClassAttendance />} />
          </Route>
          <Route path="setting" element={<Settings />} />
          <Route path="logout" element={<Logout />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
