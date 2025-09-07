import React, { useState } from 'react';
import MerchantSearch from '../components/MerchantSearch';
import cardsData from '../data/cards.json';

interface Card {
  id: string;
  name: string;
  network: string;
  annual_fee: number;
  reward_rates: { [category: string]: number };
  perks: string[];
  source?: string;
  category?: string;
  signup_bonus?: string;
}

const SmartMatch: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const questions = [
    {
      id: 0,
      question: "What's your primary spending category?",
      options: [
        { value: "dining", label: "🍽️ Dining & Restaurants" },
        { value: "groceries", label: "🛒 Groceries & Supermarkets" },
        { value: "travel", label: "✈️ Travel & Hotels" },
        { value: "gas", label: "⛽ Gas & Transportation" },
        { value: "general", label: "🛍️ General Purchases" }
      ]
    },
    {
      id: 1,
      question: "What type of rewards do you prefer?",
      options: [
        { value: "cashback", label: "💰 Cash Back" },
        { value: "points", label: "🎯 Points/Miles" },
        { value: "travel", label: "✈️ Travel Benefits" },
        { value: "flexible", label: "🔄 Flexible Rewards" }
      ]
    },
    {
      id: 2,
      question: "What's your annual fee preference?",
      options: [
        { value: "none", label: "💸 No Annual Fee" },
        { value: "low", label: "💵 Low Fee ($1-$99)" },
        { value: "medium", label: "💴 Medium Fee ($100-$299)" },
        { value: "high", label: "💎 High Fee ($300+)" }
      ]
    }
  ];

  const scoreCard = (card: Card): number => {
    let score = 0;
    
    const primaryCategory = answers[0];
    const rewardType = answers[1];
    const feePreference = answers[2];

    if (primaryCategory && card.reward_rates[primaryCategory]) {
      score += card.reward_rates[primaryCategory] * 40;
    } else if (primaryCategory === 'general' && card.reward_rates.other) {
      score += card.reward_rates.other * 40;
    }

    if (feePreference) {
      const fee = card.annual_fee;
      if (feePreference === 'none' && fee === 0) score += 30;
      else if (feePreference === 'low' && fee > 0 && fee <= 99) score += 30;
      else if (feePreference === 'medium' && fee >= 100 && fee <= 299) score += 30;
      else if (feePreference === 'high' && fee >= 300) score += 30;
      else if (feePreference !== 'none' && fee === 0) score += 15;
    }

    if (rewardType === 'travel' && (card.reward_rates.travel || card.reward_rates.flights || card.reward_rates.hotels)) {
      score += 30;
    } else if (rewardType === 'cashback' && card.name.toLowerCase().includes('cash')) {
      score += 30;
    } else if (rewardType === 'points' && !card.name.toLowerCase().includes('cash')) {
      score += 30;
    } else if (rewardType === 'flexible') {
      score += 20;
    }

    return score;
  };

  const getRecommendations = (): Card[] => {
    const cards = cardsData as unknown as Card[];
    const scoredCards = cards.map(card => ({
      ...card,
      score: scoreCard(card)
    }));
    
    return scoredCards
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
  };

  const isQuizComplete = Object.keys(answers).length === questions.length;
  const recommendations = isQuizComplete ? getRecommendations() : [];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🎯 Smart Match</h1>
        <p>Find your perfect credit card with our personalized quiz</p>
      </div>

      <div className="quiz-container">
        {!isQuizComplete ? (
          <div className="card quiz-card">
            <div className="quiz-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className="progress-text">
                Question {currentStep + 1} of {questions.length}
              </span>
            </div>

            <div className="quiz-question">
              <h3>{questions[currentStep].question}</h3>
              <div className="quiz-options">
                {questions[currentStep].options.map((option) => (
                  <button
                    key={option.value}
                    className={`quiz-option ${answers[currentStep] === option.value ? 'selected' : ''}`}
                    onClick={() => handleAnswer(currentStep, option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="quiz-navigation">
              <button 
                onClick={prevStep} 
                disabled={currentStep === 0}
                className="btn-secondary"
              >
                Previous
              </button>
              <button 
                onClick={nextStep} 
                disabled={!answers[currentStep] || currentStep === questions.length - 1}
                className="btn-primary"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="quiz-results">
            <div className="card">
              <h3>🎉 Your Personalized Recommendations</h3>
              <div className="results-summary">
                <p><strong>Primary Category:</strong> {answers[0]}</p>
                <p><strong>Reward Type:</strong> {answers[1]}</p>
                <p><strong>Annual Fee:</strong> {answers[2]}</p>
              </div>
              
              <div className="recommended-cards">
                <h4>Top Matches for You:</h4>
                {recommendations.map((card, index) => (
                  <div key={card.id} className="recommendation-card">
                    <div className="card-rank">#{index + 1}</div>
                    <div className="card-details">
                      <h5>{card.name}</h5>
                      <p className="card-network">{card.network}</p>
                      <p className="card-fee">
                        Annual Fee: {card.annual_fee === 0 ? 'No Fee' : `$${card.annual_fee}`}
                      </p>
                      <div className="reward-highlights">
                        {Object.entries(card.reward_rates).map(([category, rate]) => (
                          rate > 1 && (
                            <span key={category} className="reward-badge">
                              {rate}x {category}
                            </span>
                          )
                        ))}
                      </div>
                      <div className="card-perks">
                        {card.perks.slice(0, 2).map((perk, i) => (
                          <p key={i} className="perk-item">• {perk}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={resetQuiz} className="btn-secondary">
                Take Quiz Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="merchant-search-section">
        <h3>🔍 Or Search by Merchant</h3>
        <MerchantSearch />
      </div>
    </div>
  );
};

export default SmartMatch;
