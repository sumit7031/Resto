import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import KitchenPage from './pages/KitchenPage';
import './index.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: '12px',
              fontSize: '14px',
              maxWidth: '320px'
            }
          }}
        />
        <Navbar />
        <div style={{ paddingBottom: '80px' }}>
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/kitchen" element={<KitchenPage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;