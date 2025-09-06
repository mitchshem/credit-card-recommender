import React, { useState } from 'react';

const UpgradeGuide: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState('');

  const upgradeOptions = [
    {
      from: "Chase Sapphire Preferred",
      to: "Chase Sapphire Reserve",
      benefits: ["3x dining/travel vs 2x", "$300 travel credit", "Priority Pass lounge access"],
      cost: "$550 vs $95 annual fee",
      recommendation: "Worth it if you spend $300+ on travel annually"
    },
    {
      from: "Amex Gold",
      to: "Amex Platinum",
      benefits: ["5x flights vs 3x", "Centurion lounge access", "Hotel elite status"],
      cost: "$695 vs $250 annual fee",
      recommendation: "Best for frequent travelers who value lounge access"
    },
    {
      from: "Capital One Venture",
      to: "Capital One Venture X",
      benefits: ["10x hotels vs 2x", "$300 travel credit", "Priority Pass access"],
      cost: "$395 vs $95 annual fee",
      recommendation: "Excellent value with effective $95 annual fee"
    }
  ];

  const downgradeOptions = [
    {
      from: "Chase Sapphire Reserve",
      to: "Chase Sapphire Preferred",
      reason: "Reduce annual fee if not using travel benefits",
      savings: "$455 annual fee difference"
    },
    {
      from: "Amex Platinum",
      to: "Amex Gold",
      reason: "Better for dining/grocery spending",
      savings: "$445 annual fee difference"
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📈 Upgrade/Downgrade Guide</h1>
        <p>Learn when to upgrade or downgrade your credit cards for maximum value</p>
      </div>

      <div className="guide-sections">
        <div className="section">
          <h3>⬆️ Upgrade Opportunities</h3>
          <div className="options-grid">
            {upgradeOptions.map((option, index) => (
              <div key={index} className="card option-card">
                <div className="option-header">
                  <h4>{option.from} → {option.to}</h4>
                </div>
                <div className="option-content">
                  <div className="benefits">
                    <strong>Additional Benefits:</strong>
                    <ul>
                      {option.benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="cost">
                    <strong>Cost:</strong> {option.cost}
                  </div>
                  <div className="recommendation">
                    <strong>Recommendation:</strong> {option.recommendation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>⬇️ Downgrade Considerations</h3>
          <div className="options-grid">
            {downgradeOptions.map((option, index) => (
              <div key={index} className="card option-card downgrade">
                <div className="option-header">
                  <h4>{option.from} → {option.to}</h4>
                </div>
                <div className="option-content">
                  <div className="reason">
                    <strong>When to Consider:</strong> {option.reason}
                  </div>
                  <div className="savings">
                    <strong>Savings:</strong> {option.savings}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>🧮 Upgrade Calculator</h3>
          <div className="card">
            <div className="calculator-form">
              <div className="form-group">
                <label>Current Card:</label>
                <select 
                  value={selectedCard} 
                  onChange={(e) => setSelectedCard(e.target.value)}
                >
                  <option value="">Select your current card</option>
                  <option value="csp">Chase Sapphire Preferred</option>
                  <option value="amex_gold">Amex Gold</option>
                  <option value="venture">Capital One Venture</option>
                </select>
              </div>
              
              {selectedCard && (
                <div className="calculator-results">
                  <h4>Upgrade Analysis</h4>
                  <p>Based on your spending patterns, we'll calculate if an upgrade makes sense.</p>
                  <div className="placeholder-content">
                    <p><em>Interactive calculator coming soon</em></p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="section">
          <h3>📚 General Guidelines</h3>
          <div className="card">
            <div className="guidelines">
              <div className="guideline-item">
                <h4>✅ Consider Upgrading When:</h4>
                <ul>
                  <li>Your spending patterns align with premium card benefits</li>
                  <li>You can utilize travel credits and perks</li>
                  <li>The additional rewards offset the higher annual fee</li>
                  <li>You value premium perks like lounge access</li>
                </ul>
              </div>
              
              <div className="guideline-item">
                <h4>❌ Consider Downgrading When:</h4>
                <ul>
                  <li>You're not using the premium benefits</li>
                  <li>Your spending doesn't justify the annual fee</li>
                  <li>You want to simplify your wallet</li>
                  <li>You're not traveling frequently</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeGuide;
