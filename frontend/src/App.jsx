// // src/App.jsx
// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './contexts/AuthContext';
// import Navbar from './components/ui/Navbar';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Agronomists from './pages/Agronomist';
// import Dashboard from './pages/Dashboard';
// import Consultations from './pages/Consultations';
// import Subscriptions from './pages/Subscription';
// import Chat from './pages/Chat';
// import { ChatProvider } from './contexts/ChatContext';

// function ProtectedRoute({ children }) {
//   const { user } = useAuth();
//   return user ? children : <Navigate to="/login" />;
// }

// function App() {
//   return (
//     <AuthProvider>
//         <div className="min-h-screen bg-gray-50">
//           <Navbar />
//           <main>
//             <ChatProvider>
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/register" element={<Register />} />
//               <Route path="/agronomists" element={<ProtectedRoute><Agronomists /></ProtectedRoute>} />
//               <Route path="/consultations" element={<ProtectedRoute><Consultations /></ProtectedRoute>} />
//               <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
//               <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//               <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

//             </Routes>
//             </ChatProvider>
//           </main>
//         </div>
//         </AuthProvider>
//   );
// }

// export default App;

