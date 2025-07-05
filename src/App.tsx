import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CarProvider } from './context/CarContext';
import HomePage from './pages/HomePage';
import AddCarPage from './pages/AddCarPage';
import CarDetailsPage from './pages/CarDetailsPage';
import Header from './components/Header';

function App() {
  return (
    <CarProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/add-car" element={<AddCarPage />} />
              <Route path="/car/:id" element={<CarDetailsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CarProvider>
  );
}

export default App;