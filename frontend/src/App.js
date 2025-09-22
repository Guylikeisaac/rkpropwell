import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import SellProperty from './pages/SellProperty';

// Context
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/properties/:id" element={<PropertyDetails />} />
                <Route path="/buy" element={<Properties type="buy" />} />
                <Route path="/rent" element={<Properties type="rent" />} />
                <Route path="/sell" element={
                  <ProtectedRoute>
                    <Properties type="sell" />
                  </ProtectedRoute>
                } />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/add-property" element={
                  <ProtectedRoute>
                    <AddProperty />
                  </ProtectedRoute>
                } />
                <Route path="/admin/edit-property/:id" element={
                  <ProtectedRoute>
                    <EditProperty />
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/register" element={<UserRegister />} />
                <Route path="/sell-property" element={
                  <ProtectedRoute>
                    <SellProperty />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;