// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1 className='text-current'>Vite + React</h1>
//       <div className="card">
        
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App;
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/ui/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from '../src/pages/Dashboard';
import Profile from './pages/Profile';
import SearchAgronomists from '../src/pages/searchAgronomist';
import ConsultationCreate from './pages/ConsultationCreate';
import Consultations from './pages/ConsultationCreate';
import Subscriptions from '../src/pages/Subscription';
import NotFound from './pages/NotFound';
import ProtectedRoute from '../src/components/ui/protectedRoute';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<SearchAgronomists />} />
            <Route path="/consultations/new" element={<ConsultationCreate />} />
            <Route path="/consultations" element={<Consultations />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="bg-white border-t py-4 text-center text-sm">
        © {new Date().getFullYear()} FarmConnect
      </footer>
    </div>
  );
}

