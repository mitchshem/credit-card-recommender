import React, { useState } from 'react';
import Layout from './components/Layout';
import Advisor from './pages/Advisor';
import Priorities from './pages/Priorities';
import Wallet from './pages/Wallet';
import Compare from './pages/Compare';
import UpgradeGuide from './pages/UpgradeGuide';

type Page = 'advisor' | 'priorities' | 'wallet' | 'compare' | 'upgrade-guide';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('advisor');

  const renderPage = () => {
    switch (currentPage) {
      case 'advisor':
        return <Advisor />;
      case 'priorities':
        return <Priorities />;
      case 'wallet':
        return <Wallet />;
      case 'compare':
        return <Compare />;
      case 'upgrade-guide':
        return <UpgradeGuide />;
      default:
        return <Advisor />;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
