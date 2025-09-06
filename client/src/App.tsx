import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import ExploreCards from './pages/ExploreCards';
import SmartMatch from './pages/SmartMatch';
import Goals from './pages/Goals';
import PointsConverter from './pages/PointsConverter';
import RotatingCategories from './pages/RotatingCategories';
import Analytics from './pages/Analytics';
import UpgradeGuide from './pages/UpgradeGuide';
import Learn from './pages/Learn';
import Account from './pages/Account';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/explore" element={<ExploreCards />} />
          <Route path="/smart-match" element={<SmartMatch />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/points-converter" element={<PointsConverter />} />
          <Route path="/rotating-categories" element={<RotatingCategories />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/upgrade-guide" element={<UpgradeGuide />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
