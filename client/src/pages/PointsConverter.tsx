import React, { useState } from 'react';

const PointsConverter: React.FC = () => {
  const [pointsAmount, setPointsAmount] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('chase');

  const conversionRates = {
    chase: { name: 'Chase Ultimate Rewards', rate: 0.012, travel: 0.015 },
    amex: { name: 'American Express MR', rate: 0.011, travel: 0.014 },
    citi: { name: 'Citi ThankYou', rate: 0.010, travel: 0.013 },
    capital_one: { name: 'Capital One Miles', rate: 0.010, travel: 0.010 },
    discover: { name: 'Discover Cashback', rate: 0.010, travel: 0.010 }
  };

  const calculateValue = (points: number, rate: number) => {
    return (points * rate).toFixed(2);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>💰 Points Converter</h1>
        <p>Calculate the cash value of your credit card points and miles</p>
      </div>

      <div className="converter-section">
        <div className="card">
          <h3>Points Value Calculator</h3>
          
          <div className="converter-form">
            <div className="form-group">
              <label>Points/Miles Amount:</label>
              <input
                type="number"
                value={pointsAmount}
                onChange={(e) => setPointsAmount(e.target.value)}
                placeholder="Enter points amount"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Rewards Program:</label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="form-select"
              >
                {Object.entries(conversionRates).map(([key, program]) => (
                  <option key={key} value={key}>{program.name}</option>
                ))}
              </select>
            </div>
          </div>

          {pointsAmount && (
            <div className="conversion-results">
              <h4>Estimated Values:</h4>
              <div className="value-grid">
                <div className="value-item">
                  <span className="value-label">Cash Value:</span>
                  <span className="value-amount">
                    ${calculateValue(parseInt(pointsAmount), conversionRates[selectedProgram as keyof typeof conversionRates].rate)}
                  </span>
                </div>
                <div className="value-item">
                  <span className="value-label">Travel Value:</span>
                  <span className="value-amount">
                    ${calculateValue(parseInt(pointsAmount), conversionRates[selectedProgram as keyof typeof conversionRates].travel)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Conversion Tips</h3>
          <ul>
            <li>Travel redemptions typically offer better value than cash</li>
            <li>Transfer partners can provide even higher value</li>
            <li>Consider redemption fees and restrictions</li>
            <li>Values can vary significantly based on specific redemptions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PointsConverter;
