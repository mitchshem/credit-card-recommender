import React, { useState } from 'react';

const PointsConverter: React.FC = () => {
  const [pointsAmount, setPointsAmount] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('chase');

  interface TransferPartner {
    name: string;
    rate: number;
  }

  interface ConversionProgram {
    name: string;
    rate: number;
    travel: number;
    transferPartners: TransferPartner[];
  }

  const conversionRates: { [key: string]: ConversionProgram } = {
    chase: { 
      name: 'Chase Ultimate Rewards', 
      rate: 0.012, 
      travel: 0.015,
      transferPartners: [
        { name: 'Hyatt', rate: 0.018 },
        { name: 'United Airlines', rate: 0.014 },
        { name: 'Southwest', rate: 0.013 }
      ]
    },
    amex: { 
      name: 'American Express MR', 
      rate: 0.011, 
      travel: 0.014,
      transferPartners: [
        { name: 'Delta SkyMiles', rate: 0.016 },
        { name: 'Hilton Honors', rate: 0.012 },
        { name: 'Marriott Bonvoy', rate: 0.013 }
      ]
    },
    citi: { 
      name: 'Citi ThankYou', 
      rate: 0.010, 
      travel: 0.013,
      transferPartners: [
        { name: 'Turkish Airlines', rate: 0.015 },
        { name: 'JetBlue TrueBlue', rate: 0.014 }
      ]
    },
    capital_one: { 
      name: 'Capital One Miles', 
      rate: 0.010, 
      travel: 0.010,
      transferPartners: [
        { name: 'Turkish Airlines', rate: 0.014 },
        { name: 'Air Canada Aeroplan', rate: 0.013 }
      ]
    },
    discover: { 
      name: 'Discover Cashback', 
      rate: 0.010, 
      travel: 0.010,
      transferPartners: []
    },
    bilt: {
      name: 'Bilt Rewards',
      rate: 0.012,
      travel: 0.015,
      transferPartners: [
        { name: 'American Airlines', rate: 0.016 },
        { name: 'Hyatt', rate: 0.018 }
      ]
    },
    wells_fargo: {
      name: 'Wells Fargo Rewards',
      rate: 0.010,
      travel: 0.010,
      transferPartners: []
    }
  };

  const hotelPrograms = {
    marriott: { name: 'Marriott Bonvoy', rate: 0.008 },
    hilton: { name: 'Hilton Honors', rate: 0.005 },
    hyatt: { name: 'World of Hyatt', rate: 0.018 },
    ihg: { name: 'IHG One Rewards', rate: 0.007 }
  };

  const airlinePrograms = {
    united: { name: 'United MileagePlus', rate: 0.014 },
    delta: { name: 'Delta SkyMiles', rate: 0.012 },
    american: { name: 'American AAdvantage', rate: 0.014 },
    southwest: { name: 'Southwest Rapid Rewards', rate: 0.013 },
    jetblue: { name: 'JetBlue TrueBlue', rate: 0.014 }
  };

  const calculateValue = (points: number, rate: number) => {
    return (points * rate).toFixed(2);
  };

  const getBestTransferValue = () => {
    const program = conversionRates[selectedProgram];
    if (!program || !program.transferPartners || program.transferPartners.length === 0) {
      return null;
    }
    
    const bestPartner = program.transferPartners.reduce((best: TransferPartner, current: TransferPartner) => 
      current.rate > best.rate ? current : best
    );
    
    return {
      partner: bestPartner.name,
      value: calculateValue(parseInt(pointsAmount), bestPartner.rate)
    };
  };

  const bestTransfer = pointsAmount ? getBestTransferValue() : null;

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
                    ${calculateValue(parseInt(pointsAmount), conversionRates[selectedProgram].rate)}
                  </span>
                </div>
                <div className="value-item">
                  <span className="value-label">Travel Portal:</span>
                  <span className="value-amount">
                    ${calculateValue(parseInt(pointsAmount), conversionRates[selectedProgram].travel)}
                  </span>
                </div>
                {bestTransfer && (
                  <div className="value-item best-value">
                    <span className="value-label">Best Transfer ({bestTransfer.partner}):</span>
                    <span className="value-amount">${bestTransfer.value}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Hotel Programs</h3>
          <div className="program-rates">
            {Object.entries(hotelPrograms).map(([key, program]) => (
              <div key={key} className="rate-item">
                <span className="program-name">{program.name}</span>
                <span className="rate-value">{program.rate}¢ per point</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Airline Programs</h3>
          <div className="program-rates">
            {Object.entries(airlinePrograms).map(([key, program]) => (
              <div key={key} className="rate-item">
                <span className="program-name">{program.name}</span>
                <span className="rate-value">{program.rate}¢ per mile</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>💡 Maximization Tips</h3>
          <ul>
            <li>Transfer partners often provide the highest value redemptions</li>
            <li>Book travel during off-peak times for better award availability</li>
            <li>Consider redemption fees when calculating true value</li>
            <li>Hotel points are typically worth less than airline miles</li>
            <li>Cash back is guaranteed value, points can fluctuate</li>
            <li>Use travel portals for consistent 1.25-1.5x value</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PointsConverter;
