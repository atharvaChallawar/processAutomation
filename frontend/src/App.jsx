import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Components/compos/SideBar/Layout';
import LandingPage from './Components/pages/LandingPage';
import StockOps from './Components/pages/StockOps';
import StockAlerts from './Components/pages/StockAlerts';
import StockFlow from './Components/pages/StockFlow';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="StockOps" element={<StockOps />} />
          <Route path="StockAlerts" element={<StockAlerts />} />
          <Route path="StockFlow" element={<StockFlow />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;