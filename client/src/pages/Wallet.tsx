import React from 'react';
import MerchantSearch from '../components/MerchantSearch';

const Wallet: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>💳 My Wallet</h1>
        <p>Manage your credit cards and get personalized recommendations</p>
      </div>
      
      <MerchantSearch />
    </div>
  );
};

export default Wallet;
