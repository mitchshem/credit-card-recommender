import React, { useState } from 'react';
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

type Page = 'home' | 'wallet' | 'explore' | 'smart-match' | 'goals' | 'points-converter' | 'rotating-categories' | 'analytics' | 'upgrade-guide' | 'learn' | 'account';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home />;
      case 'wallet': return <Wallet />;
      case 'explore': return <ExploreCards />;
      case 'smart-match': return <SmartMatch />;
      case 'goals': return <Goals />;
      case 'points-converter': return <PointsConverter />;
      case 'rotating-categories': return <RotatingCategories />;
      case 'analytics': return <Analytics />;
      case 'upgrade-guide': return <UpgradeGuide />;
      case 'learn': return <Learn />;
      case 'account': return <Account />;
      default: return <Home />;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
